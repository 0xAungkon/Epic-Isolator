import os
import peewee as pw
from app.config.settings import get_settings

settings = get_settings()

# Expand the user path to get the absolute path
db_path = os.path.expanduser(settings.DB_PATH)

# Ensure the directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Create the database instance
database = pw.SqliteDatabase(db_path)

def init_db():
    """Initialize the database connection and create tables"""
    from app.models.app import App
    from app.models.user import User
    from app.models.backup import Backup
    
    # Connect to the database
    database.connect()
    
    # Create tables if they don't exist
    database.create_tables([App, User, Backup], safe=True)
    
    return database