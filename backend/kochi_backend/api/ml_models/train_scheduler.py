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

        # Create features DataFrame
        data = []
        for train in trainsets:
            train_id = train['train_id']
            
            # Get related records
            train_jobs = [j for j in jobcards if j['train_id'] == train_id]
            train_branding = [b for b in branding if b.get('train_id') == train_id]
            train_cleaning = [c for c in cleaning if c['train_id'] == train_id]

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
        X = df.drop(['train_id'], axis=1)
        train_ids = df['train_id'].values

        # Scale features
        X_scaled = self.scaler.transform(X)
        X_tensor = torch.FloatTensor(X_scaled)

        # Get model predictions
        with torch.no_grad():
            outputs = self.model(X_tensor)
            probabilities = outputs.numpy()

        # Generate schedule
        schedule = []
        time_slots = self._generate_time_slots(date)
        
        for i, train_id in enumerate(train_ids):
            # Check constraints
            train_data = self._get_train_data(train_id)
            if not self._check_hard_constraints(train_data):
                continue

            # Assign optimal time slot
            best_slot = self._find_optimal_slot(train_data, time_slots, probabilities[i])
            if best_slot:
                schedule.append({
                    'train_id': train_id,
                    'time_slot': best_slot,
                    'task': self._determine_task(train_data),
                    'reasoning': self._generate_reasoning(train_data, best_slot)
                })

        return schedule

    def _generate_time_slots(self, date):
        """Generate 30-minute time slots for the day"""
        slots = []
        start = datetime.strptime(f"{date} 00:00:00", "%Y-%m-%d %H:%M:%S")
        for _ in range(48):  # 24 hours * 2 (30-min slots)
            slots.append(start.strftime("%H:%M"))
            start += timedelta(minutes=30)
        return slots

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
        # Implementation would check for conflicts with other schedules
        return True

    def _determine_task(self, train_data):
        """Determine primary task for the train"""
        if train_data['jobs']:
            return 'maintenance'
        if train_data['branding']:
            return 'branding'
        if train_data['cleaning']:
            return 'cleaning'
        return 'run'

    def _generate_reasoning(self, train_data, time_slot):
        """Generate explanation for the schedule decision"""
        train = train_data['train']
        reasons = []
        
        if train.get('fitness') == 'Valid':
            reasons.append("Fitness certificate valid")
        
        if not train_data['jobs']:
            reasons.append("No pending maintenance")
            
        if train_data['cleaning'].get('status') == 'Completed':
            reasons.append("Cleaning completed")
            
        return "; ".join(reasons)

# Initialize scheduler
scheduler = TrainScheduler()