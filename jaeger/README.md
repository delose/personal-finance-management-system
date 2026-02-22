# Jaeger Distributed Tracing POC

Demonstrates end-to-end distributed tracing across PFMS microservices using **Micrometer Tracing + OpenTelemetry + Jaeger**.

## Architecture

```
Client (curl)
    |
    v
API Gateway (:8080)  ──[HTTP + W3C trace context]──>  Budget Service (:8082)
                                                            |
                                                     [Kafka: notification_requests_topic]
                                                            |
                                                            v
                                                     Notification Service (:8085)

All services export traces via OTLP HTTP ──> Jaeger (:4318)
Jaeger UI available at http://localhost:16686
```

## What This POC Shows

1. **Trace propagation across HTTP** - A single request to the API Gateway generates a trace that spans into budget-service via Spring Cloud Gateway's `lb://` routing
2. **Trace context in Kafka** - When budget-service produces a message to Kafka, the trace context (W3C `traceparent` header) is automatically propagated as a Kafka record header
3. **Trace context in logs** - Each service logs `[service-name, traceId, spanId]` so you can correlate logs with Jaeger traces
4. **Span hierarchy** - Jaeger visualizes parent-child span relationships: HTTP request → service processing → Kafka produce → Kafka consume

## Stack

| Component | Version | Role |
|-----------|---------|------|
| Micrometer Tracing | (managed by Spring Boot 3.3.3 BOM) | Vendor-neutral tracing facade |
| micrometer-tracing-bridge-otel | (managed) | Bridges Micrometer to OpenTelemetry |
| opentelemetry-exporter-otlp | 1.41.0 | Exports spans via OTLP HTTP to Jaeger |
| Jaeger (all-in-one) | 1.62 | Collects, stores, and visualizes traces |

## Prerequisites

- Java 17+ (for budget-service, notification-service)
- Java 21 (for api-gateway)
- Docker & Docker Compose
- Maven

## Steps to Run

### 1. Create the Docker network (if not already created)

```bash
docker network create pfms-network
```

### 2. Start Kafka

```bash
cd /path/to/pfms/kafka
docker compose up -d
```

Wait ~10 seconds for Kafka to be ready. Verify:

```bash
docker exec global-service-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### 3. Start Jaeger

```bash
cd /path/to/pfms/jaeger
docker compose up -d
```

Verify Jaeger is running by opening http://localhost:16686 in your browser.

### 4. Start Config Server (required by budget-service)

```bash
cd /path/to/pfms/config-server
mvn spring-boot:run
```

Wait for it to start on port 8888.

### 5. Start Discovery Server (required by API Gateway routing)

```bash
cd /path/to/pfms/discovery-server
mvn spring-boot:run
```

Wait for Eureka to start on port 8761.

### 6. Start the three instrumented services

Open three separate terminals:

**Terminal A - Budget Service (port 8082):**
```bash
cd /path/to/pfms/budget-service
mvn spring-boot:run
```

**Terminal B - Notification Service (port 8085):**
```bash
cd /path/to/pfms/notification-service
mvn spring-boot:run
```

**Terminal C - API Gateway (port 8080):**
```bash
cd /path/to/pfms/api-gateway
mvn spring-boot:run
```

### 7. Create a test user and get a JWT token

```bash
# Register
curl -s -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"trace@test.dev","password":"test1234","fullName":"Trace Tester"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trace@test.dev","password":"test1234"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN
```

### 8. Create a budget (this triggers the traced flow)

```bash
curl -v -X POST http://localhost:8080/v1/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "trace-user-1",
    "category": "FOOD",
    "amount": 500.00,
    "startDate": "2026-02-01",
    "endDate": "2026-02-28"
  }'
```

### 9. View the trace in Jaeger

1. Open http://localhost:16686
2. In the **Service** dropdown, select `budget-service` (or `api-gateway`)
3. Click **Find Traces**
4. Click on the trace to see the span waterfall

## What to Look For in Jaeger

### Trace Waterfall

A successful trace for `POST /v1/api/budgets` shows spans like:

```
api-gateway
  └─ GET /v1/api/budgets/**  (Spring Cloud Gateway routing)
      └─ budget-service
          └─ POST /v1/api/budgets  (controller handling)
              └─ notification_requests_topic send  (Kafka producer)
                  └─ notification-service
                      └─ notification_requests_topic process  (Kafka consumer)
```

### Key Observations

- **Single Trace ID**: All spans share the same `traceId`, proving end-to-end correlation
- **Timing**: The waterfall shows how long each hop takes, making it easy to identify bottlenecks
- **Kafka async gap**: Notice the time gap between the Kafka `send` span and the `process` span - this is the Kafka consumer poll interval
- **Service boundaries**: Each service appears as a separate "process" in Jaeger, color-coded differently

### Log Correlation

In each service's terminal output, you'll see log lines like:

```
INFO [budget-service,abc123def456,789xyz...]  Produced budget message topic: notification_requests_topic
INFO [notification-service,abc123def456,qrs456...]  Received message in consumer: BudgetNotification{...}
```

The `abc123def456` is the `traceId` - it matches across both services and corresponds to the trace in Jaeger UI.

## Talking Points for Your Lead

1. **Why Jaeger?** - Open-source, CNCF graduated, vendor-neutral. Works with OpenTelemetry (the industry standard for observability)

2. **Why Micrometer + OTel (not the OTel Java Agent)?** - Spring Boot 3.x has native Micrometer Tracing support. It auto-instruments Spring MVC, WebFlux, RestTemplate, WebClient, Kafka, and `@Async` methods with zero code changes. The Java Agent approach requires JVM flags and is harder to control.

3. **Zero code changes** - We didn't modify any Java source code. All instrumentation is automatic via Spring Boot auto-configuration + dependencies + YAML config.

4. **Production considerations:**
   - Lower sampling rate (e.g., `probability: 0.1` for 10%) to reduce overhead
   - Use Jaeger with Elasticsearch or Cassandra backend for persistence (all-in-one uses in-memory storage)
   - Add alerting on trace latency via Grafana + Jaeger data source

5. **W3C Trace Context** - We use the W3C standard (`traceparent` header), not proprietary formats. This means any service in any language that supports W3C can participate in the same trace.

## Cleanup

```bash
# Stop Jaeger
cd /path/to/pfms/jaeger
docker compose down

# Stop Kafka
cd /path/to/pfms/kafka
docker compose down

# Stop the Java services with Ctrl+C in each terminal
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No traces in Jaeger | Check that Jaeger container is running: `docker ps \| grep jaeger` |
| Services can't reach Jaeger | Services run on host, Jaeger in Docker. The endpoint `http://localhost:4318` works because port 4318 is mapped to host |
| No trace IDs in logs | Verify `logging.pattern.level` is set in application.yml / properties |
| Kafka consumer not showing spans | Ensure notification-service has `micrometer-tracing-bridge-otel` on classpath (inherited from parent pom) |
| Config server errors | Budget service needs config-server running at localhost:8888 (it uses `optional:configserver:` so it can start without it, but port config comes from there) |
