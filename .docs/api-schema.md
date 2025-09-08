# API Schema Documentation

This document details all API endpoints, request/response formats, and error codes for the Epic Isolator platform.

## 1. Authentication APIs

### POST /auth/login
* **Description**: Validate credentials and return JWT
* **Request**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
* **Response 200**:
  ```json
  {
    "access-token": "string"
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
    "deb_url": "string",
    "file_upload": "file",
    "advanced_options": {
      "cpu_limit": "float",
      "ram_limit": "float",
      "custom_commands": ["string"],
      "docker_image": "string",
      "ssh_port": "int"
    },
  }
  ```
* **Response 200**:
  ```json
  {
    "status": "success",
    "app_id": "integer"
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
      "id": "integer",
      "name": "string",
      "status": "string"
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
    "logs": "string"
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
    "backup_file": "string"
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
    "backup_file": "file"
  }
  ```
* **Response 200**:
  ```json
  {
    "status": "success",
    "new_app_id": "integer"
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
    "cpu": "float",
    "ram": "float"
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
      "app_id": "integer",
      "cpu": "float",
      "ram": "float"
    }
  ]
  ```
* **Notes**: Metrics fetched via Docker Stats API, polling every 30s
* **Errors**:
  * `500 Internal Server Error`: Docker API error
