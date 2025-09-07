# Project Description: Epic Isolator

## Overview

**Epic Isolator** is a **web-based desktop platform** designed to isolate and manage GUI software inside Docker Linux containers.  
It installs and launches GUI applications in Docker containers, integrates **SSH with X11 forwarding (`ssh -X`)** for GUI rendering directly on the host display, and provides application management and monitoring through a modern web interface.  

Inspired by **Umbrel OS** and **CasaOS**, the system emphasizes **simplicity, modularity, and real-time monitoring**, enabling smooth containerized application operations.  

*Made by: Opshive Team – Vision to make your operations smoother.*

---

## Core Features

### Authentication

* **Single-user system.**
* No registration flow.
* Username and password are defined in environment variables (`.env` file).
* Authentication via **JWT tokens** with no expiration.

---

### Dashboard

* **Grid view of installed apps**: icon, name, **Launch** button.
* **Header**:
  * Left: *Epic Isolator* branding.
  * Right: Dark/Light mode toggle, Logout.
* **Top of main content area**:
  * **Install App** button.
  * **Restore Backup** button.

---

### App Installation

* Default base: **Ubuntu Docker container**.
* Input methods:
  * Provide `.deb` package URL.
  * Upload `.deb` file directly.
* **Advanced Options** (expandable):
  * Installation command (default: `apt-get install <file>`).
  * Custom Docker image.
  * Custom SSH port.
  * Container user.
  * Volumes.
  * IP.
  * Network type.
  * Custom launch command.
* **Install Flow**:
  1. Shows app icon + spinner.
  2. Click during installation → *“Show build logs”* (terminal-style UI).
  3. On success → Toast notification with app icon, name, and “Want to try out?” + **Launch** button.

---

### App Context Menu (Right Click)

* Launch
* Info
* Logs
* Terminal
* Restart
* Kill
* Uninstall
* Backup (commit container → downloadable image snapshot)

---

### Sidebar

* **Collapsible sidebar.**
* Real-time **CPU and RAM usage charts.**
* List of all apps with their individual resource consumption.
* Footer text: *“Built with love, sponsored by Opshive.”*

---

## Data Sources

1. **Logs**:  
   * Saved to files.  
   * Retention policy: cleared when container restarts or stops.  
   * No database table required.  

2. **Backups**:  
   * Snapshot of container (commit → image).  
   * Downloadable backup.  
   * No database table required.  

3. **Resource Metrics**:  
   * Real-time from host and Docker APIs.  
   * No database table required.  

4. **User**:  
   * Credentials from `.env` file (username, password).  
   * No user table in database.  

5. **Apps**:  
   * Installed apps stored in database (metadata, status, configs).  

---

## UI/UX

* Inspired by **Umbrel OS**.  
* Supports **Dark and Light modes.**  
* Minimal, modern design.  
* Collapsible sidebar.  

---

## Architecture

### Frontend

* **Framework**: React.js  
* **Routing (pages)**:
  1. Login
  2. Dashboard
* **Components**:
  * Header
  * Collapsible Sidebar
  * Main Content Area
  * Install Application Modal
  * Restore Backup Modal
  * Right-Click Context Menu
  * Resource Monitoring Charts
  * Utility components

---

### Backend

* **Framework**: FastAPI  
* **Database**: SQLite  
* **ORM**: SQLModel  
* **Authentication**: JWT tokens (no expiration)  
* **Tools/Packages**:  
  * `fastapi`  
  * `sqlmodel`  
  * `python-jose` (JWT)  
  * `passlib` (hashing, if needed for env credentials)  
  * `docker` (Python SDK)  
  * `paramiko` or `asyncssh` (SSH integration)  

---

### APIs

* **Auth APIs**:
  * `POST /auth/login` → Validate env credentials, return JWT.  

* **App Management APIs**:
  * `POST /apps/install` → Install new app (via `.deb` URL or file).  
  * `GET /apps` → List all apps.  
  * `GET /apps/{id}` → App details.  
  * `POST /apps/{id}/launch` → Launch app in container (GUI shown on host).  
  * `POST /apps/{id}/restart` → Restart container.  
  * `POST /apps/{id}/kill` → Kill container.  
  * `DELETE /apps/{id}` → Uninstall app.  

* **Logs APIs**:
  * `GET /apps/{id}/logs` → Fetch logs from log file.  

* **Backup APIs**:
  * `POST /apps/{id}/backup` → Commit container to image, provide downloadable link.  
  * `POST /apps/restore` → Restore app from uploaded snapshot.  

* **Monitoring APIs**:
  * `GET /system/resources` → Host CPU, RAM, and Docker stats (streaming supported).  
  * `GET /apps/resources` → Per-app resource usage.  

---

## Vision

The vision of **Epic Isolator** is to **run any GUI package or software in an isolated containerized environment** while maintaining real-time system monitoring, simple application management, and secure single-user access.  

It combines **application management + resource monitoring** in one desktop platform.  

Comparable to **Umbrel OS** and **CasaOS**, but uniquely tailored to **GUI container management**.

---
