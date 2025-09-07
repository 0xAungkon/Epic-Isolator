# Backend Architecture

This document details the backend architecture, data models, and implementation details for the Epic Isolator platform.

## 1. Technology Stack

* **Framework**: FastAPI
* **Database**: SQLite
* **ORM**: SQLModel
* **Authentication**: JWT tokens via python-jose
* **Password Hashing**: passlib
* **Container Management**: Docker SDK for Python
* **SSH Handling**: paramiko / asyncssh

## 2. Application Structure

### 2.1 Core Modules
* **app** - Main application package
  * **api** - API routes and controllers
  * **models** - Data models and schemas
  * **services** - Business logic and services
  * **utils** - Helper functions and utilities
  * **config** - Application configuration

### 2.2 API Structure
* **/auth** - Authentication endpoints
* **/apps** - Application management
* **/system** - System monitoring and resources

## 3. Data Models

### 3.1 Database Schema

#### Apps Table
| Column | Type | Description |
| --- | --- | --- |
| id | INTEGER | Primary key |
| name | TEXT | App name |
| icon | TEXT | App icon URL |
| status | TEXT | Enum: `running`, `stopped`, `failed` |
| config | TEXT | JSON (CPU/RAM limits, ports, etc.) |

### 3.2 Data Storage

* **Database**: SQLite database for app metadata
* **File Storage**:
  * `~/epic-isolator/backups` - Application backups
  * `~/epic-isolator/logs` - Application logs (`<app_name>_<app_id>/<date>.log`)

## 4. Core Services

### 4.1 Authentication Service
* JWT token generation and validation
* Password hashing and verification
* Environment-based credential configuration

### 4.2 Docker Service
* Container creation and management
* Image building and configuration
* X11/Wayland integration for GUI apps
* Resource limiting and monitoring

### 4.3 App Management Service
* Application installation from .deb packages
* Launch, restart, kill, and uninstall operations
* Backup and restore functionality

### 4.4 Monitoring Service
* System resource monitoring
* Application resource usage tracking via Docker Stats API
* 30-second polling interval for metrics

## 5. Security Considerations

* Single-user system with no registration
* Non-expiring JWT for persistent sessions
* Isolated containers for application execution
* Docker security best practices

## 6. Performance Optimization

* Async handlers for non-blocking operations
* Docker resource limits enforcement
* Efficient log rotation and storage

## 7. Error Handling

* Consistent error response format
* Appropriate HTTP status codes
* Detailed error logging
* User-friendly error messages

## 8. File Hierarchy

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   └── environment.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── apps.py
│   │   └── system.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── app.py
│   │   ├── backup.py
│   │   └── user.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── docker_service.py
│   │   ├── app_service.py
│   │   ├── monitoring_service.py
│   │   └── backup_service.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── docker_utils.py
│   │   ├── file_utils.py
│   │   └── logging.py
│   └── db/
│       ├── __init__.py
│       ├── session.py
│       └── migrations/
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_apps.py
│   └── test_system.py
├── scripts/
│   ├── install.sh
│   └── setup_environment.sh
├── .env.example
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

## 9. Module Functionality

### 9.1 Core Module Details

* **main.py**: Application entry point, FastAPI app configuration
* **config/**: Environment variables, settings management
* **api/**: Route definitions and endpoint handlers
* **models/**: SQLModel data models and Pydantic schemas
* **services/**: Business logic implementation
* **utils/**: Helper functions and utilities
* **db/**: Database connection and migration management

### 9.2 Service Layer Breakdown

* **auth_service.py**: 
  * User authentication and JWT token management
  * Password verification
  * Session handling

* **docker_service.py**:
  * Container lifecycle management (create, start, stop, remove)
  * Image building and pulling
  * Volume management
  * X11/Wayland socket binding
  * Resource limit enforcement

* **app_service.py**:
  * Application installation from .deb packages
  * Application metadata management
  * Launch orchestration
  * Uninstallation cleanup

* **monitoring_service.py**:
  * Docker stats collection
  * System resource monitoring
  * Metrics aggregation
  * Real-time data streaming

* **backup_service.py**:
  * Container backup creation
  * Backup metadata management
  * Restore operations

### 9.3 API Layer Structure

* **auth.py**:
  * `/auth/login`: User authentication
  * `/auth/verify`: Token verification

* **apps.py**:
  * `/apps`: List installed apps
  * `/apps/install`: Install new app
  * `/apps/{id}/launch`: Launch app
  * `/apps/{id}/logs`: Fetch app logs
  * `/apps/{id}/backup`: Create backup
  * `/apps/restore`: Restore from backup

* **system.py**:
  * `/system/resources`: System resource metrics
  * `/apps/resources`: Per-app resource metrics

### 9.4 Database Architecture

* **SQLite Database**:
  * Single file stored in `~/epic-isolator/data/epic.db`
  * SQLModel ORM for data access
  * Migrations handled via Alembic

* **File Storage**:
  * Organized by app ID and resource type
  * Proper file permissions for security
  * Automatic cleanup on uninstallation
