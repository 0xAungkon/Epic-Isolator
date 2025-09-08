# API Schema Documentation

This document details all API endpoints, request/response formats, and error codes for the Epic Isolator platform.

## 1. Authentication APIs

### POST /auth/login
* **Description**: Validate credentials and return JWT
* **Request**:
  ```json
  {
    "username": "user@example.com",
    "password": "securepassword123"
  }
  ```
* **Response 200**:
  ```json
  {
    "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Errors**:
  * `401 Unauthorized`: Invalid credentials
  * `500 Internal Server Error`: Authentication service error

## 2. App Management APIs

### POST /apps/install
* **Description**: Install a new application
* **Request**:
  ```json
  {
    "deb_url": "https://example.com/app.deb",
    "file_upload": null,
    "advanced_options": {
      "cpu_limit": 1.5,
      "ram_limit": 2048,
      "custom_commands_before_install": [
        "apt-get update",
        "echo Pre-install step"
      ],
      "custom_commands_after_install": [
        "echo Post-install step"
      ],
      "docker_image": "ubuntu:22.04",
      "ssh_port": 2222,
      "mounts": [
        "/host/data:/container/data"
      ],
      "env_vars": {
        "ENV_MODE": "production",
        "DEBUG": "false"
      },
      "remapped_mounts": {
        "/host/config": "/container/config"
      },
      "remapped_ports": {
        "8080": "80"
      }
    }
  }
  ```
* **Response 200**:
  ```json
  {
    "status": "success",
    "app_id": 12345
  }
  ```
* **Errors**:
  * `400 Bad Request`: Invalid `.deb` or parameters
  * `409 Conflict`: App already installed
  * `500 Internal Server Error`: Docker build failure

### GET /apps
* **Description**: List all installed apps
* **Response 200**:
  ```json
  [
    {
      "id": 1,
      "name": "Sample App",
      "status": "running"
    },
    {
      "id": 2,
      "name": "Another App",
      "status": "stopped"
    }
  ]
  ```
* **Errors**:
  * `500 Internal Server Error`: Database read error

### POST /apps/{id}/launch
* **Description**: Launch an installed app
* **Response 200**:
  ```json
  { "status": "success" }
  ```
* **Errors**:
  * `404 Not Found`: App not found
  * `500 Internal Server Error`: Launch failure

## 3. Logs APIs

### GET /apps/{id}/logs
* **Description**: Fetch logs for an app
* **Response 200**:
  ```json
  {
    "logs": "Log entry 1\nLog entry 2\nLog entry 3"
  }
  ```
* **Errors**:
  * `404 Not Found`: Log file not found
  * `500 Internal Server Error`: File read error

## 4. Backup APIs

### POST /apps/{id}/backup
* **Description**: Create a backup of an app
* **Response 200**:
  ```json
  {
    "backup_file": "backup_12345.tar.gz"
  }
  ```
* **Errors**:
  * `404 Not Found`: App not found
  * `500 Internal Server Error`: Backup failure

### POST /apps/restore
* **Description**: Restore an app from a backup
* **Request**:
  ```json
  {
    "backup_file": "backup_12345.tar.gz"
  }
  ```
* **Response 200**:
  ```json
  {
    "status": "success",
    "new_app_id": 67890
  }
  ```
* **Errors**:
  * `400 Bad Request`: Invalid backup format
  * `500 Internal Server Error`: Restore failure

## 5. Monitoring APIs

### GET /system/resources
* **Description**: Fetch system resource usage
* **Response 200**:
  ```json
  {
    "cpu": 45.6,
    "ram": 2048.0
  }
  ```
* **Errors**:
  * `500 Internal Server Error`: Stats fetch error

### GET /apps/resources
* **Description**: Fetch resource usage per app
* **Response 200**:
  ```json
  [
    {
      "app_id": 1,
      "cpu": 12.3,
      "ram": 512.0
    },
    {
      "app_id": 2,
      "cpu": 8.7,
      "ram": 1024.0
    }
  ]
  ```
* **Notes**: Metrics fetched via Docker Stats API, polling every 30s
* **Errors**:
  * `500 Internal Server Error`: Docker API error
