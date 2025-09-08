# Epic Isolator - FastAPI Backend

A FastAPI-based backend for the Epic Isolator platform, designed to manage isolated application environments using Docker containers.

## Features

- RESTful API for application management
- User authentication with JWT tokens
- Docker container management
- Application backup and restore capabilities
- System monitoring and resource usage statistics

## Project Structure

```
backend/
├── app/
│   ├── api/             # API routes and controllers
│   ├── config/          # Configuration settings
│   ├── db/              # Database connection and migrations
│   ├── models/          # Data models (using Peewee ORM)
│   ├── services/        # Business logic services
│   ├── utils/           # Helper functions
│   └── main.py          # FastAPI application entry point
├── Dockerfile           # Docker container definition
├── docker-compose.yml   # Docker Compose configuration
└── requirements.txt     # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.9+
- Docker
- Docker Compose (optional, for easy deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/epic-isolator.git
   cd epic-isolator/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your configuration:
   ```
   SECRET_KEY=your-secret-key
   DB_PATH=~/epic-isolator/data/epic.db
   BACKUP_DIR=~/epic-isolator/backups
   LOG_DIR=~/epic-isolator/logs
   ```

### Running the Application

#### Using Python

```
uvicorn app.main:app --reload
```

#### Using Docker Compose

```
docker-compose up -d
```

## API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

Run the tests using pytest:

```
pytest
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
