import peewee as pw
from app.models.base import BaseModel
from app.models.app import App

class Backup(BaseModel):
    """Model for application backups"""
    app = pw.ForeignKeyField(App, backref='backups')
    filename = pw.CharField(max_length=255)
    size = pw.IntegerField()  # Size in bytes
    backup_type = pw.CharField(max_length=20)  # full, data, config
    status = pw.CharField(max_length=20, default="complete")  # complete, failed, in_progress
    notes = pw.TextField(null=True)
    
    def __str__(self):
        return f"{self.app.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"