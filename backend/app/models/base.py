import datetime
import peewee as pw
from app.db.session import database

class BaseModel(pw.Model):
    """Base model for all database models"""
    created_at = pw.DateTimeField(default=datetime.datetime.now)
    updated_at = pw.DateTimeField(default=datetime.datetime.now)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now()
        return super(BaseModel, self).save(*args, **kwargs)
    
    class Meta:
        database = database