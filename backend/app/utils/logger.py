import os
import logging
from logging.handlers import RotatingFileHandler
import sys

from app.config.settings import get_settings

settings = get_settings()

# Ensure log directory exists
log_dir = os.path.expanduser(settings.LOG_DIR)
os.makedirs(log_dir, exist_ok=True)

# Set up log file paths
app_log_file = os.path.join(log_dir, "app.log")
error_log_file = os.path.join(log_dir, "error.log")

# Configure logging
def setup_logger(name, log_file, level=logging.INFO):
    """Set up a logger with file and console handlers"""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Create handlers
    file_handler = RotatingFileHandler(
        log_file, maxBytes=10485760, backupCount=5
    )
    console_handler = logging.StreamHandler(sys.stdout)
    
    # Create formatters and set for handlers
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Create loggers
app_logger = setup_logger('app', app_log_file)
error_logger = setup_logger('error', error_log_file, level=logging.ERROR)