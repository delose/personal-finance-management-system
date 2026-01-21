# PFMS Analytics Service (Go)

A lightweight, high-performance Go microservice for the Personal Finance Management System (PFMS). This service handles data aggregation and AI-driven insights.

## 🚀 Features
- **Multi-stage Docker Build**: Produces a minimal `scratch` image (~10MB).
- **Zero Local Dependencies**: Built and run entirely via Docker (no local Go install required).
- **JSON API**: Provides real-time financial analytics endpoints.

## 🛠 Prerequisites
- [Docker Desktop](https://www.docker.com) or Docker Engine (2026 stable)
- Docker Compose V2

## 🚦 Getting Started

### 1. Initialize (One-time setup)
If you are adding new dependencies, initialize the Go module using Docker:
```bash
./run-docker.sh
```