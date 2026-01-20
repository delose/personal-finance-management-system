#!/bin/bash


docker run --rm -v "$PWD":/app -w /app golang:1.24-alpine go mod init pfms/analytics-service

