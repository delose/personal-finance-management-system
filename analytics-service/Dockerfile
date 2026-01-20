# Stage 1: Build binary using official Go image
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod ./
# RUN go mod download # Uncomment if you add external dependencies later
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o analytics-service .

# Stage 2: Minimal runtime image
FROM scratch
WORKDIR /
COPY --from=builder /app/analytics-service /analytics-service
EXPOSE 8081
ENTRYPOINT ["/analytics-service"]


