# PFMS — Iterative Implementation Roadmap & Specifications
**Version:** 1.0 · **Date:** 2026-02-11

---

## Implementation Phases

### Phase 0: Foundation & DevEx (Weeks 1-2)

**Goal:** Make the codebase professional and safe to iterate on.

#### Step 0.1: Unified Docker Compose

**Files to create/modify:**
- CREATE `docker-compose.yml` (root) — single orchestration file
- DELETE `kafka/docker-compose.yml`, `message-broker/docker-compose.yml`, per-service compose files

**Specification:**
```yaml
# Profiles:
#   default       = infra + backend
#   infra         = postgres, mysql, mongodb, kafka, rabbitmq, consul, redis
#   backend       = all 10 services
#   observability = prometheus, grafana, loki, jaeger
#
# Health checks on all services with depends_on conditions
# Shared network: pfms-network
# Volume mounts for database persistence
```

**Services in `infra` profile:**

| Service | Image | Ports | Health Check |
|---------|-------|-------|--------------|
| postgres | postgres:16-alpine | 5432 | pg_isready |
| mysql | mysql:8.0 | 3307 | mysqladmin ping |
| mongodb | mongo:7 | 3308 | mongosh --eval 'db.runCommand("ping")' |
| kafka | confluentinc/cp-kafka:7.6.0 | 9092, 29092 | kafka-topics --bootstrap-server=localhost:9092 --list |
| rabbitmq | rabbitmq:4-management-alpine | 5672, 15672 | rabbitmq-diagnostics -q ping |
| consul | hashicorp/consul:1.18 | 8500 | consul members |
| redis | redis:7-alpine | 6379 | redis-cli ping |

#### Step 0.2: Security Hardening

**Files to modify:**
- `config-repo/api-gateway.properties` — replace `jwt.secret.key=...` with `${JWT_SECRET}`
- `config-repo/api-gateway-dev.properties` — replace hardcoded MySQL creds with `${MYSQL_*}`
- `transaction-service/src/app.module.ts` — replace `amqp://guest:guest@` with `process.env.RABBITMQ_URL`
- `account-service/src/main.ts` — same RMQ URL externalization
- `notification-service/src/main/resources/application.yml` — replace MongoDB `admin:secret` with `${MONGO_*}`
- CREATE `.env.example` at root documenting all required env vars

#### Step 0.3: Input Validation

**Files to modify:**
- `api-gateway/src/main/java/.../dto/RegisterUserDto.java` — add `@NotBlank`, `@Email`, `@Size(min=8)`
- `api-gateway/src/main/java/.../dto/LoginUserDto.java` — add `@NotBlank`, `@Email`
- `api-gateway/src/main/java/.../controller/AuthenticationController.java` — add `@Valid` on `@RequestBody`
- `budget-service/src/main/java/.../entity/Budget.java` — add `@NotNull`, `@Positive`, `@NotBlank` on fields
- `budget-service/src/main/java/.../controller/BudgetControllerV1.java` — add `@Valid`
- `goal-service/` — CREATE `GoalRequestDto.java`, `GoalResponseDto.java`; update `GoalController.java`
- `transaction-service/` — CREATE `create-transaction.dto.ts` with class-validator decorators
- `account-service/` — CREATE DTOs with class-validator
- `expense-service/app/Http/Requests/` — CREATE `StoreExpenseRequest.php`, `UpdateExpenseRequest.php`

#### Step 0.4: Database Migrations

**Files to create:**
- `budget-service/src/main/resources/db/migration/V1__create_budgets_table.sql`
- `goal-service/src/main/resources/db/migration/V1__create_goals_table.sql`
- `api-gateway/src/main/resources/db/migration/V1__create_users_table.sql`
- `notification-service/` — MongoDB; no SQL migrations needed

**Files to modify:**
- All `application*.yml`: change `ddl-auto: update` to `ddl-auto: validate`
- All Spring Boot `pom.xml`: add `org.flywaydb:flyway-core` dependency

#### Step 0.5: Structured Logging

**Files to create/modify:**
- `budget-service/src/main/resources/logback-spring.xml` — JSON layout with logstash-encoder
- Same for goal-service, notification-service, api-gateway
- `transaction-service/src/main.ts` — add `nestjs-pino`
- `account-service/src/main.ts` — add `nestjs-pino`
- `analytics-service/main.go` — add `rs/zerolog`
- `reporting-service/app/main.py` — add `python-json-logger`

#### Step 0.6: CI/CD Pipeline

**Files to create:**
- `.github/workflows/ci.yml`

```yaml
# Matrix strategy:
#   java-services: [api-gateway, budget-service, goal-service, notification-service, config-server, discovery-server]
#     -> mvn verify -pl $service
#   node-services: [transaction-service, account-service]
#     -> npm ci && npm test
#   go-services: [analytics-service]
#     -> go test ./...
#   python-services: [reporting-service]
#     -> pytest
#   php-services: [expense-service]
#     -> php artisan test
#
# Trigger: on push to main, on PR to main
# Also: Docker image build + push to GHCR on merge to main
```

---

### Phase 1: Core Fintech — Transaction & Account (Weeks 3-4)

**Goal:** Make the two stub NestJS services functional with real persistence and event emission.

#### Step 1.1: Transaction Service — Entity & CRUD

**Files to create:**
- `transaction-service/src/entities/transaction.entity.ts`
- `transaction-service/src/dto/create-transaction.dto.ts`
- `transaction-service/src/dto/update-transaction.dto.ts`
- `transaction-service/src/dto/transaction-query.dto.ts`
- `transaction-service/src/transactions/transactions.module.ts`
- `transaction-service/src/transactions/transactions.controller.ts`
- `transaction-service/src/transactions/transactions.service.ts`
- `transaction-service/src/migrations/1_CreateTransactionsTable.ts`

**Entity specification:**
```typescript
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')                              id: string;
  @Column()                                                    userId: string;
  @Column('decimal', { precision: 12, scale: 2 })             amount: number;
  @Column({ type: 'enum', enum: TransactionType })            type: TransactionType;
  @Column()                                                    category: string;
  @Column({ nullable: true })                                  description: string;
  @Column({ type: 'date' })                                    date: Date;
  @Column('uuid')                                              accountId: string;
  @Column({ default: false })                                  isRecurring: boolean;
  @Column({ type: 'enum', enum: Frequency, nullable: true })  recurringFrequency: Frequency;
  @CreateDateColumn()                                          createdAt: Date;
  @UpdateDateColumn()                                          updatedAt: Date;
}
```

**Event emission:** After successful save:
1. RabbitMQ `account.balance.debit` or `account.balance.credit` (command to account-service)
2. Kafka `transaction.created` (event for analytics, budget, reporting)

#### Step 1.2: Account Service — Entity & Balance Tracking

**Files to create:**
- `account-service/src/entities/account.entity.ts`
- `account-service/src/entities/balance-history.entity.ts`
- `account-service/src/dto/account-response.dto.ts`
- `account-service/src/accounts/accounts.module.ts`
- `account-service/src/accounts/accounts.controller.ts`
- `account-service/src/accounts/accounts.service.ts`
- `account-service/src/migrations/1_CreateAccountsTables.ts`

**Event handling:**
- On RMQ `account.create` -> create Account, initialize balance to 0
- On RMQ `account.balance.debit` -> subtract amount, insert BalanceHistory row
- On RMQ `account.balance.credit` -> add amount, insert BalanceHistory row
- After balance update -> emit Kafka `account.balance.updated`

#### Step 1.3: Shared Event Contracts

**Files to create:**
- `shared/events/transaction.created.schema.json` (from CONTRACTS.md section 2.1)
- `shared/events/account.balance.updated.schema.json` (from CONTRACTS.md section 2.6)
- `shared/events/envelope.schema.json` (from CONTRACTS.md section 4)

---

### Phase 2: Goal Redesign & Budget Integration (Weeks 5-6)

#### Step 2.1: Goal Entity Redesign

**Files to modify:**
- `goal-service/src/main/java/.../entity/Goal.java` — add `userId`, `targetAmount`, `currentAmount`, `deadline`, `priority`, `status`, `category`; remove `completed`
- `goal-service/src/main/java/.../controller/GoalController.java` — accept DTOs, add `/contribute` endpoint

**Files to create:**
- `goal-service/src/main/java/.../dto/GoalRequestDto.java`
- `goal-service/src/main/java/.../dto/GoalResponseDto.java`
- `goal-service/src/main/java/.../dto/GoalProgressDto.java`
- `goal-service/src/main/resources/db/migration/V2__redesign_goals_table.sql`

**Migration SQL:**
```sql
ALTER TABLE goals ADD COLUMN user_id VARCHAR(255);
ALTER TABLE goals ADD COLUMN target_amount DECIMAL(12,2);
ALTER TABLE goals ADD COLUMN current_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE goals ADD COLUMN deadline DATE;
ALTER TABLE goals ADD COLUMN priority VARCHAR(10) DEFAULT 'MEDIUM';
ALTER TABLE goals ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE goals ADD COLUMN category VARCHAR(30);
ALTER TABLE goals DROP COLUMN completed;
```

#### Step 2.2: Kafka Producer for Goal Milestones

**Files to create:**
- `goal-service/src/main/java/.../producer/GoalEventProducer.java`
- `goal-service/src/main/java/.../config/KafkaTopicConfig.java` — define `goal.milestone.reached` topic

**Logic:** In `GoalService.contribute()`, after updating `currentAmount`:
```java
double percent = currentAmount.divide(targetAmount, 4, RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100)).doubleValue();
if (crossesMilestone(previousPercent, percent, 25)) {
    goalEventProducer.sendMilestone(goal, "25_PERCENT");
}
// Same for 50, 75, 100
```

#### Step 2.3: Budget vs. Actual Integration

**Files to create:**
- `budget-service/src/main/java/.../entity/BudgetSpending.java`
- `budget-service/src/main/java/.../consumer/TransactionEventConsumer.java` — listens to `transaction.created`
- `budget-service/src/main/java/.../producer/BudgetAlertProducer.java` — emits `budget.limit.warning`
- `budget-service/src/main/resources/db/migration/V2__create_budget_spending_table.sql`

**Files to modify:**
- `budget-service/src/main/java/.../controller/BudgetControllerV1.java` — include `spent`, `remaining` in response
- `budget-service/src/main/java/.../dto/BudgetResponseDto.java` (CREATE) — add `spent` and `remaining` fields

---

### Phase 3: Analytics & Reporting (Weeks 7-8)

#### Step 3.1: Analytics Service Full Implementation

**Files to create/replace:**
- `analytics-service/main.go` — full rewrite with chi router
- `analytics-service/internal/kafka/consumer.go` — Kafka consumer group
- `analytics-service/internal/db/timescaledb.go` — pgx connection pool + hypertable setup
- `analytics-service/internal/handlers/analytics.go` — HTTP handlers
- `analytics-service/internal/models/events.go` — event structs matching JSON schemas
- `analytics-service/internal/consul/registration.go` — Consul health check registration
- `analytics-service/migrations/001_create_hypertables.sql`

**Dependencies to add to `go.mod`:**
- `github.com/go-chi/chi/v5`
- `github.com/segmentio/kafka-go`
- `github.com/jackc/pgx/v5`
- `github.com/rs/zerolog`
- `github.com/hashicorp/consul/api`
- `github.com/prometheus/client_golang`
- `go.opentelemetry.io/otel`

#### Step 3.2: Reporting Service — CQRS Read Model

**Files to create:**
- `reporting-service/app/consumers/kafka_consumer.py` — consume events, build materialized views
- `reporting-service/app/routers/reports.py` — `/spending-trends`, `/budget-utilization`, `/net-worth`
- `reporting-service/app/models/schemas.py` — Pydantic response models
- `reporting-service/app/infrastructure/timescaledb.py` — async DB client (asyncpg)
- `reporting-service/migrations/001_create_read_models.sql`

**Dependencies to add to `requirements.txt`:**
- `asyncpg`
- `aiokafka` (already present)

---

### Phase 4: AI Advisor (Weeks 9-10)

#### Step 4.1: Service Scaffold

**Files to create:**
- `ai-advisor-service/app/__init__.py`
- `ai-advisor-service/app/main.py` — FastAPI app with Consul registration
- `ai-advisor-service/app/routers/__init__.py`
- `ai-advisor-service/app/routers/advisor.py` — `/ask`, `/categorize`, `/health-score`
- `ai-advisor-service/app/services/__init__.py`
- `ai-advisor-service/app/services/llm_client.py` — Claude API client with tool definitions
- `ai-advisor-service/app/services/context_builder.py` — gathers user data from other services via HTTP
- `ai-advisor-service/app/services/prompt_templates.py` — Jinja2 system prompts
- `ai-advisor-service/app/models/__init__.py`
- `ai-advisor-service/app/models/schemas.py` — request/response Pydantic models
- `ai-advisor-service/app/middleware/rate_limiter.py` — slowapi rate limiting
- `ai-advisor-service/requirements.txt`
- `ai-advisor-service/Dockerfile`
- `ai-advisor-service/tests/test_advisor.py`

**Dependencies:**
```
anthropic>=0.40.0
fastapi[standard]>=0.128.0
httpx>=0.27.0
slowapi>=0.1.9
python-consul2>=0.1.5
jinja2>=3.1.0
cachetools>=5.0.0
pydantic-settings>=2.0.0
uvicorn>=0.40.0
pytest>=8.0.0
respx>=0.21.0
```

#### Step 4.2: Agentic Tool Use (P2)

**Files to create:**
- `ai-advisor-service/app/services/tools.py` — Claude tool definitions (see RESEARCH.md section 3.3)
- `ai-advisor-service/app/services/tool_executor.py` — maps tool calls to HTTP requests against PFMS services

**Flow:**
1. User sends message to `/api/advisor/ask`
2. Context builder gathers user's financial data (goals, budgets, recent transactions)
3. System prompt + context + user message sent to Claude API with tool definitions
4. If Claude returns tool_use, tool_executor calls the appropriate PFMS service endpoint
5. Tool results sent back to Claude for final response synthesis
6. Response returned to user with suggested actions

---

### Phase 5: Observability (Weeks 11-12)

#### Step 5.1: Distributed Tracing

**Files to modify (all Java services):** Add to `pom.xml`:
```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

**Docker Compose addition:**
```yaml
jaeger:
  image: jaegertracing/all-in-one:1.54
  ports: ["16686:16686", "4317:4317"]
  profiles: ["observability"]
```

#### Step 5.2: Prometheus + Grafana

**Files to create:**
- `observability/prometheus/prometheus.yml` — scrape configs for all services
- `observability/grafana/provisioning/dashboards/pfms-overview.json` — pre-provisioned dashboard
- `observability/grafana/provisioning/datasources/datasource.yml` — Prometheus + Loki datasources

#### Step 5.3: Centralized Logging

**Files to create:**
- `observability/loki/loki-config.yml`
- `observability/promtail/promtail-config.yml` — scrape Docker container logs

---

### Phase 6: Frontend Transformation (Weeks 13-14)

#### Step 6.1: TanStack Query Migration

**Files to create:**
- `pfms-ui/src/hooks/useBudgets.ts`
- `pfms-ui/src/hooks/useGoals.ts`
- `pfms-ui/src/hooks/useTransactions.ts`
- `pfms-ui/src/hooks/useAccounts.ts`
- `pfms-ui/src/hooks/useAnalytics.ts`

**Files to modify:**
- `pfms-ui/src/App.tsx` — wrap with `QueryClientProvider`
- `pfms-ui/src/pages/BudgetPage.tsx` — replace manual fetching with `useBudgets()`
- `pfms-ui/src/pages/ExpensesPage.tsx` — replace manual fetching
- `pfms-ui/src/services/api.ts` — convert to query functions (no more inline state)

**Dependencies to add:** `@tanstack/react-query`, `@tanstack/react-query-devtools`

#### Step 6.2: Goals Page

**Files to modify:**
- `pfms-ui/src/pages/GoalsPage.tsx` — replace "Coming Soon" with full implementation:
  - Goal cards with thermometer progress bars
  - Create goal form (title, targetAmount, category, deadline, priority)
  - Contribute button with amount input
  - Milestone badges (25/50/75/100%)
  - Filter by status (ACTIVE/PAUSED/COMPLETED) and category

#### Step 6.3: Reports Page

**Files to modify:**
- `pfms-ui/src/pages/ReportsPage.tsx` — replace "Coming Soon" with charts:
  - Spending by category donut chart (Recharts PieChart)
  - Income vs expense area chart (Recharts AreaChart)
  - Budget utilization heatmap
  - Monthly comparison bar chart (Recharts BarChart)

**Dependencies to add:** `recharts`

#### Step 6.4: Gamification UI

**Files to create:**
- `pfms-ui/src/components/StreakCounter.tsx` — animated flame with Framer Motion (already available)
- `pfms-ui/src/components/AchievementBadge.tsx` — unlock animations
- `pfms-ui/src/components/CelebrationOverlay.tsx` — confetti on goal milestones

---

### Phase 7: Advanced Patterns (Weeks 15-16)

#### Step 7.1: Saga — "Contribute to Goal"

**Flow:**
1. Client calls `POST /api/goals/:id/contribute` (goal-service)
2. Goal-service generates `sagaId`, emits `transaction.created` (Kafka) with type=EXPENSE
3. Account-service updates balance, emits `account.balance.updated` (Kafka) with sagaId
4. Goal-service consumes `account.balance.updated`, matches `sagaId`, updates `currentAmount`
5. On failure at step 3, account-service emits `account.balance.update.failed`, goal-service rolls back

**Files to create:**
- `goal-service/src/main/java/.../saga/GoalContributionSaga.java`
- `goal-service/src/main/java/.../consumer/AccountBalanceEventConsumer.java`

#### Step 7.2: CQRS Read Model (Reporting)

Already covered in Phase 3 Step 3.2 — reporting-service consumes events and builds pre-aggregated views in TimescaleDB.

#### Step 7.3: Circuit Breaker Expansion

**Files to modify:**
- Add `@CircuitBreaker` to all inter-service HTTP calls (not just goal-to-budget)
- API gateway: route-level circuit breakers in Spring Cloud Gateway config
- CREATE `goal-service/src/main/java/.../actuator/CircuitBreakerEndpoint.java` — expose `/circuit-breaker-status`

---

## Verification Plan

### Per-Phase Verification

| Phase | Verification |
|-------|-------------|
| Phase 0 | `docker compose up -d --profile infra` starts all infra; `task test` runs all tests green; `task lint` passes; CI/CD pipeline runs on PR |
| Phase 1 | `POST /transactions` persists to DB, emits Kafka + RMQ events; `GET /accounts/:id/balance` returns correct balance after transactions |
| Phase 2 | `POST /api/goals/:id/contribute` updates currentAmount; milestone event fires at threshold; `budget.limit.warning` fires at 80% spending |
| Phase 3 | `GET /api/analytics/spending-by-category` returns real data from TimescaleDB; reporting endpoints serve pre-aggregated data |
| Phase 4 | `POST /api/advisor/ask` returns Claude-powered response with user financial context; rate limiting blocks excessive requests |
| Phase 5 | Jaeger UI shows traces spanning multiple services; Grafana dashboards display RED metrics for all services |
| Phase 6 | Goals page renders real goals with progress; Reports page shows charts with real data; TanStack Query provides caching/refetching |
| Phase 7 | Contribute-to-goal saga completes end-to-end; failure at any step triggers compensating event |

### End-to-End Smoke Test

```bash
# 1. Start everything
docker compose up -d

# 2. Register user
curl -X POST localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@pfms.dev","password":"test1234","fullName":"Test User"}'

# 3. Login
TOKEN=$(curl -s -X POST localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@pfms.dev","password":"test1234"}' | jq -r '.token')

# 4. Create account
curl -X POST localhost:3004/account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Checking","type":"CHECKING"}'

# 5. Create budget
curl -X POST localhost:8080/v1/api/budgets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"FOOD","amount":"500.00","startDate":"2026-02-01","endDate":"2026-02-28"}'

# 6. Create transaction
curl -X POST localhost:3004/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"45.00","type":"EXPENSE","category":"FOOD","date":"2026-02-11","accountId":"<from step 4>"}'

# 7. Check balance updated
curl localhost:3003/accounts/<id>/balance \
  -H "Authorization: Bearer $TOKEN"

# 8. Check analytics populated
curl "localhost:8081/api/analytics/spending-by-category?userId=<id>&from=2026-02-01&to=2026-02-28"

# 9. Create goal and contribute
curl -X POST localhost:8080/api/goals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Vacation","targetAmount":"5000.00","category":"VACATION"}'

curl -X POST localhost:8080/api/goals/1/contribute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"500.00"}'

# 10. Ask AI advisor
curl -X POST localhost:3010/api/advisor/ask \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Am I on track for my vacation?"}'
```

---

## Dockerized Tool Stack

| Tool | Image | Purpose | Profile |
|------|-------|---------|---------|
| PostgreSQL | `postgres:16-alpine` | Primary DB for most services | infra |
| MySQL | `mysql:8.0` | API Gateway user store | infra |
| MongoDB | `mongo:7` | Notification storage | infra |
| TimescaleDB | `timescale/timescaledb:latest-pg16` | Analytics/CQRS read store | infra |
| Redis | `redis:7-alpine` | Caching, rate limiting | infra |
| Kafka | `confluentinc/cp-kafka:7.6.0` | Event streaming | infra |
| RabbitMQ | `rabbitmq:4-management-alpine` | Message queue | infra |
| Consul | `hashicorp/consul:1.18` | Polyglot service discovery | infra |
| Prometheus | `prom/prometheus` | Metrics collection | observability |
| Grafana | `grafana/grafana` | Dashboards | observability |
| Loki + Promtail | `grafana/loki` + `grafana/promtail` | Centralized logging | observability |
| Jaeger | `jaegertracing/all-in-one:1.54` | Distributed tracing | observability |
| Mailhog | `mailhog/mailhog` | Email testing for notifications | observability |
| pgAdmin | `dpage/pgadmin4` | DB management UI | observability |
| Kafka UI | `provectuslabs/kafka-ui` | Kafka topic/consumer UI | observability |
