#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to the backend directory
cd "$(dirname "$0")"

# Activate Python virtual environment (if applicable)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Export environment variables (if needed)
export ENVIRONMENT=development

# Start the FastAPI backend server
echo "Starting the FastAPI backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
