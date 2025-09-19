"""
ML API endpoints for train scheduling
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .ml_models.train_scheduler import scheduler
from datetime import datetime

@api_view(["POST"])
@permission_classes([AllowAny])
def train_model(request):
    """Train the DeepSeek model"""
    try:
        scheduler.train_model()
        return Response({"status": "success", "message": "Model trained successfully"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([AllowAny])
def generate_schedule(request):
    """Generate schedule for a specific date"""
    try:
        date = request.data.get('date', datetime.now().strftime("%Y-%m-%d"))
        schedule = scheduler.generate_schedule(date)
        return Response({
            "status": "success",
            "date": date,
            "schedule": schedule
        })
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)