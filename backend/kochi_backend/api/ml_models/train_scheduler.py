"""
Train Scheduler ML Model using DeepSeek
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
from datetime import datetime, timedelta
from kochi_backend.api.mongo import get_db

class DeepSeekScheduler(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(DeepSeekScheduler, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.layer2 = nn.Linear(hidden_size, hidden_size)
        self.layer3 = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.softmax(self.layer3(x))
        return x

class TrainScheduler:
    def __init__(self):
        self.db = get_db()
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()

    def prepare_data(self):
        """Prepare training data from MongoDB"""
        # Fetch data
        trainsets = list(self.db.trainsets.find({}, {'_id': 0}).limit(500))
        jobcards = list(self.db.jobcards.find({}, {'_id': 0}))
        branding = list(self.db.branding_campaigns.find({}, {'_id': 0}))
        cleaning = list(self.db.cleaning_slots.find({}, {'_id': 0}))

        # Station configuration
        self.stations = [
            "Aluva", "Pulinchodu", "Companypady", "Ambattukavu", "Muttom", 
            "Kalamassery", "Cochin University", "Pathadipalam", "Edapally", "Changampuzha Park",
            "Palarivattom", "JLN Stadium", "Kaloor", "Town Hall", "MG Road", "Maharaja's College",
            "Ernakulam South", "Kadavanthra", "Elamkulam", "Vyttila", "Thaikoodam", "Petta", "SN Junction"
        ]

        # Peak hours configuration
        self.peak_hours = {
            'morning': {'start': 6, 'end': 10},
            'evening': {'start': 16, 'end': 20}
        }

        # Create features DataFrame
        data = []
        for train in trainsets:
            train_id = train['train_id']
            
            # Get related records
            train_jobs = [j for j in jobcards if j['train_id'] == train_id]
            train_branding = [b for b in branding if b.get('train_id') == train_id]
            train_cleaning = [c for c in cleaning if c['train_id'] == train_id]

            # Current hour for peak/off-peak determination
            current_hour = datetime.now().hour
            is_peak = (self.peak_hours['morning']['start'] <= current_hour <= self.peak_hours['morning']['end']) or \
                     (self.peak_hours['evening']['start'] <= current_hour <= self.peak_hours['evening']['end'])

            # Feature engineering
            record = {
                'train_id': train_id,
                'mileage': float(train.get('mileage', 0)),
                'maintenance_count': len(train_jobs),
                'has_branding': 1 if train_branding else 0,
                'last_cleaned': 1 if train_cleaning else 0,
                'fitness_valid': 1 if train.get('fitness') == 'Valid' else 0,
                'passengers': int(train.get('passengers', 0)),
                'stations_covered': int(train.get('stations_covered', 0)),
                'is_peak_hour': 1 if is_peak else 0,
                'last_maintenance_days': self._days_since_last_maintenance(train_jobs),
                'priority_score': self._calculate_priority_score(train, train_jobs, is_peak)
            }
            data.append(record)

        return pd.DataFrame(data)

    def train_model(self):
        """Train the DeepSeek model"""
        # Prepare data
        df = self.prepare_data()
        
        # Separate features and target
        X = df.drop(['train_id'], axis=1)
        y = df['train_id']  # We'll predict train assignments

        # Scale features and encode labels
        X_scaled = self.scaler.fit_transform(X)
        y_encoded = self.label_encoder.fit_transform(y)

        # Convert to PyTorch tensors
        X_tensor = torch.FloatTensor(X_scaled)
        y_tensor = torch.LongTensor(y_encoded)

        # Initialize model
        input_size = X.shape[1]
        hidden_size = 64
        output_size = len(np.unique(y_encoded))
        self.model = DeepSeekScheduler(input_size, hidden_size, output_size)

        # Training parameters
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(self.model.parameters())
        epochs = 100

        # Training loop
        for epoch in range(epochs):
            optimizer.zero_grad()
            outputs = self.model(X_tensor)
            loss = criterion(outputs, y_tensor)
            loss.backward()
            optimizer.step()

    def generate_schedule(self, date):
        """Generate schedule for a specific date"""
        df = self.prepare_data()
        train_data_list = []
        
        # Get all train data and calculate priorities
        for train_id in df['train_id'].values:
            train_data = self._get_train_data(train_id)
            if self._check_hard_constraints(train_data):
                priority = df[df['train_id'] == train_id]['priority_score'].values[0]
                train_data_list.append((train_id, train_data, priority))
                
        # Sort by priority score
        train_data_list.sort(key=lambda x: x[2], reverse=True)
        
        # Initialize schedule containers
        schedule = []
        service_slots = {}
        maintenance_slots = {}
        standby_slots = {}
        time_slots = self._generate_time_slots(date)
        
        # Target numbers for balanced distribution
        total_trains = len(train_data_list)
        target_service = max(total_trains // 2, 1)  # 50% for service
        target_maintenance = max(total_trains // 4, 1)  # 25% for maintenance
        target_standby = total_trains - target_service - target_maintenance  # Remaining for standby
        
        # Distribute trains based on constraints and targets
        for train_id, train_data, priority in train_data_list:
            current_hour = datetime.now().hour
            is_peak = (self.peak_hours['morning']['start'] <= current_hour <= self.peak_hours['morning']['end']) or \
                     (self.peak_hours['evening']['start'] <= current_hour <= self.peak_hours['evening']['end'])
            
            # Check maintenance requirements first
            maintenance_needed = any(j['status'].lower() == 'open' for j in train_data['jobs'])
            
            # Determine appropriate slot based on conditions
            if maintenance_needed and len(maintenance_slots) < target_maintenance:
                task = 'maintenance'
                slots = maintenance_slots
            elif is_peak and len(service_slots) < target_service:
                task = 'service'
                slots = service_slots
            elif len(standby_slots) < target_standby:
                task = 'standby'
                slots = standby_slots
            elif len(service_slots) < target_service:
                task = 'service'
                slots = service_slots
            else:
                continue  # Skip if all slots are filled
                
            # Find optimal time slot
            best_slot = None
            for slot in time_slots:
                slot_key = f"{slot}_{train_id}"
                if slot_key not in slots and self._is_slot_available(train_data, slot):
                    best_slot = slot
                    slots[slot_key] = train_id
                    break
                    
            if best_slot:
                schedule.append({
                    'train_id': train_id,
                    'time_slot': best_slot,
                    'task': task,
                    'reasoning': self._generate_reasoning(train_data, best_slot)
                })

        return schedule

    def _generate_time_slots(self, date):
        """Generate time slots based on peak hours and maintenance windows"""
        slots = {
            'peak_morning': ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30'],
            'peak_evening': ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
            'maintenance': ['00:00', '01:00', '02:00', '03:00', '04:00', '23:00'],
            'regular': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
                       '14:00', '14:30', '15:00', '15:30', '20:00', '20:30', '21:00', '21:30', '22:00']
        }
        
        # Combine all slots for full schedule
        all_slots = []
        all_slots.extend(slots['maintenance'])
        all_slots.extend(slots['peak_morning'])
        all_slots.extend(slots['regular'])
        all_slots.extend(slots['peak_evening'])
        
        return sorted(all_slots)

    def _get_train_data(self, train_id):
        """Get all relevant data for a train"""
        return {
            'train': self.db.trainsets.find_one({'train_id': train_id}, {'_id': 0}),
            'jobs': list(self.db.jobcards.find({'train_id': train_id}, {'_id': 0})),
            'branding': self.db.branding_campaigns.find_one({'train_id': train_id}, {'_id': 0}),
            'cleaning': self.db.cleaning_slots.find_one({'train_id': train_id}, {'_id': 0})
        }

    def _check_hard_constraints(self, train_data):
        """Check if train meets hard constraints"""
        train = train_data['train']
        
        # Check fitness certificate
        if train.get('fitness') != 'Valid':
            return False
            
        # Check maintenance deadlines
        open_jobs = [j for j in train_data['jobs'] if j['status'] == 'open']
        if open_jobs:
            return False
            
        # Check cleaning status
        if not train_data['cleaning'] or train_data['cleaning']['status'] != 'Completed':
            return False
            
        return True

    def _find_optimal_slot(self, train_data, time_slots, probabilities):
        """Find optimal time slot based on constraints and probabilities"""
        for slot, prob in zip(time_slots, probabilities):
            if self._is_slot_available(train_data, slot):
                return slot
        return None

    def _is_slot_available(self, train_data, slot):
        """Check if time slot is available for the train"""
        # Parse slot time
        slot_hour = int(slot.split(':')[0])
        
        # Check peak hour restrictions
        is_peak = (self.peak_hours['morning']['start'] <= slot_hour <= self.peak_hours['morning']['end']) or \
                 (self.peak_hours['evening']['start'] <= slot_hour <= self.peak_hours['evening']['end'])
                 
        # Get station capacity
        station = train_data['train'].get('current_station', 'Aluva')
        station_idx = self.stations.index(station) if station in self.stations else 0
        
        # During peak hours, prioritize service over maintenance
        if is_peak and train_data.get('task') == 'maintenance':
            return False
            
        return True
        
    def _days_since_last_maintenance(self, jobs):
        """Calculate days since last maintenance"""
        if not jobs:
            return 30  # Default to 30 days if no maintenance history
            
        latest_job = max(jobs, key=lambda x: x.get('completion_date', '2000-01-01'))
        completion_date = latest_job.get('completion_date')
        
        if not completion_date:
            return 30
            
        try:
            completion_dt = datetime.strptime(completion_date, "%Y-%m-%d")
            days_since = (datetime.now() - completion_dt).days
            return days_since
        except:
            return 30
            
    def _calculate_priority_score(self, train, jobs, is_peak):
        """Calculate priority score for scheduling"""
        score = 0
        
        # Maintenance priority
        days_since_maintenance = self._days_since_last_maintenance(jobs)
        if days_since_maintenance > 25:  # High priority if approaching 30 days
            score += 50
        elif days_since_maintenance > 20:
            score += 30
            
        # Peak hour priority
        if is_peak:
            score += 40
            
        # Mileage priority
        mileage = float(train.get('mileage', 0))
        if mileage > 8000:
            score += 30
        elif mileage > 5000:
            score += 20
            
        # Passenger load priority
        passengers = int(train.get('passengers', 0))
        if passengers > 1500:
            score += 25
        elif passengers > 1000:
            score += 15
            
        return score

    def _determine_task(self, train_data, time_slot):
        """Determine primary task for the train based on time slot and conditions"""
        train = train_data['train']
        hour = int(time_slot.split(':')[0])
        
        # Check for active maintenance requirements
        open_jobs = [j for j in train_data['jobs'] if j['status'].lower() == 'open']
        if open_jobs and (0 <= hour <= 4 or hour == 23):
            return 'maintenance'
            
        # Peak hours service (6-10 AM and 4-8 PM)
        if (6 <= hour <= 10) or (16 <= hour <= 20):
            return 'service'
            
        # Regular hours - distribute between service and standby based on metrics
        mileage = float(train.get('mileage', 0))
        passengers = int(train.get('passengers', 0))
        
        if mileage > 5000 or passengers > 1000:
            return 'service'
        else:
            return 'standby'

    def _generate_reasoning(self, train_data, time_slot):
        """Generate explanation for the schedule decision"""
        train = train_data['train']
        reasons = []
        current_hour = datetime.now().hour
        is_peak_hour = (6 <= current_hour <= 10) or (16 <= current_hour <= 20)
        
        # Check maintenance status
        open_jobs = [j for j in train_data['jobs'] if j['status'].lower() == 'open']
        if open_jobs:
            reasons.append(f"Maintenance required: {len(open_jobs)} open job cards")
            
        # Operational metrics
        mileage = float(train.get('mileage', 0))
        passengers = int(train.get('passengers', 0))
        
        # Service/Standby reasoning
        if not open_jobs:
            if is_peak_hour:
                reasons.append("Peak hour operation (high demand period)")
            else:
                reasons.append("Non-peak hour operation")
                
            if mileage >= 5000:
                reasons.append(f"High utilization train (mileage: {mileage})")
            else:
                reasons.append(f"Low utilization train (mileage: {mileage})")
                
            if passengers >= 1000:
                reasons.append(f"High passenger load ({passengers} passengers)")
            else:
                reasons.append(f"Low passenger load ({passengers} passengers)")
                
        # Fitness certificate status
        if train.get('fitness') == 'Valid':
            reasons.append("Fitness certificate valid")
        else:
            reasons.append(f"Fitness status: {train.get('fitness', 'Unknown')}")
            
        return "; ".join(reasons)

# Initialize scheduler
scheduler = TrainScheduler()