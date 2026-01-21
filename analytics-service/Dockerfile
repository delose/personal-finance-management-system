FROM golang:1.24-alpine AS builder
WORKDIR /app

# 1. Copy only module files first
COPY go.mod ./

# 2. Download dependencies (this is cached unless go.mod changes)
RUN go mod download

# 3. Copy the rest of the source code
COPY . .

# 4. Build
RUN CGO_ENABLED=0 GOOS=linux go build -o analytics-service .
