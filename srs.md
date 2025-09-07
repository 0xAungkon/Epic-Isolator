# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to define the functional, non-functional, and technical requirements for the **Epic Isolator** platform. This specification ensures developers, testers, and stakeholders have a shared understanding of the system goals and implementation boundaries.

### 1.2 Scope

**Epic Isolator** is a personal Linux desktop application designed to create isolated environments for GUI software inside Docker containers. It provides a web-based GUI for installing, launching, monitoring, and managing applications.  
The system runs locally (via `uvx` command), requires no multi-user support, and focuses solely on isolation and management of desktop applications.

**Boundaries:**

* **OS Support**: Debian-based Linux distributions only.
* **User Mode**: Single-user, no registration flow.
* **Authentication**: Non-expiring JWT, credentials in `.env`.
* **Persistence**: All data stored under `~/epic-isolator/`.
* **Exclusions**: No scalability, clustering, cloud sync, or enterprise features.

## 2. Features

### 2.1 Authentication
* Single-user login.
* Credentials stored in `.env`.
* JWT tokens with no expiration.

### 2.2 Dashboard
* Fixed-size grid view of installed apps (icons, names, launch buttons).
* Header: branding, dark/light mode toggle, logout.
* Buttons for installing apps and restoring backups.

### 2.3 App Installation
* Default base: Ubuntu container.
* Input methods:
  * `.deb` package URL.
  * Upload `.deb` file (simple file POST).
* Advanced options:
  * Custom commands.
  * Custom Docker images.
  * CPU/RAM limits.
  * SSH port configuration.
* Installation flow: progress indicators and logs.

### 2.4 App Context Menu
* Options:
  * Launch (open via X11/Wayland).
  * Info.
  * Logs (scroll-to-bottom view).
  * Restart.
  * Kill (graceful stop, then force if needed).
  * Uninstall (remove container, image, and optional volumes).
  * Backup (save instance).

### 2.5 Sidebar
* Collapsible with real-time CPU/RAM usage charts.
* List of apps with resource consumption.
* Footer: "_Built with love, sponsored by Opshive._"

### 2.6 Data Sources
* Logs, backups, resource metrics, credentials, and app metadata.
* Stored in `~/epic-isolator/`:
  * `~/epic-isolator/backups` → Backup files (`app_id`, `timestamp`, `base_image`).
  * `~/epic-isolator/logs` → Logs (`<app_name>_<app_id>/<date>.log`).

## 3. System Requirements

* OS: Debian-based Linux (Ubuntu, Debian).
* Runtime: Python 3.11+, Docker installed.
* Browser: Any modern browser for accessing Web GUI.
