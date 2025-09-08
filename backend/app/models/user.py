import peewee as pw
from app.models.base import BaseModel

class User(BaseModel):
    """User model for authentication and authorization"""
    username = pw.CharField(max_length=100, unique=True)
    email = pw.CharField(max_length=100, unique=True)
    password_hash = pw.CharField(max_length=100)
    is_active = pw.BooleanField(default=True)
    is_admin = pw.BooleanField(default=False)
    
    def __str__(self):
        return self.username