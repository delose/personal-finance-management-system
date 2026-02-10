# PFMS — Research & Tech Stack Discovery
**Version:** 1.0 · **Date:** 2026-02-11

---

## 1. Current Technology Inventory

### 1.1 Language & Framework Versions

| Service | Language | Framework | Version | Runtime |
|---------|----------|-----------|---------|---------|
| api-gateway | Java 21 | Spring Boot 3.3.3 + WebFlux | Spring Cloud 2023.0.3 | eclipse-temurin:21 |
| budget-service | Java 17 | Spring Boot 3.3.3 | Spring Cloud 2023.0.3 | eclipse-temurin:17 |
| goal-service | Java 17 | Spring Boot 3.3.3 | Spring Cloud 2023.0.3 | eclipse-temurin:17 |
| notification-service | Java 17 | Spring Boot 3.3.3 | Spring Cloud 2023.0.3 | eclipse-temurin:17 |
| config-server | Java 17 | Spring Boot 3.3.3 | Spring Cloud 2023.0.3 | eclipse-temurin:17 |
| discovery-server | Java 17 | Spring Boot 3.3.3 | Spring Cloud 2023.0.3 | eclipse-temurin:17 |
| transaction-service | TypeScript | NestJS 11.0.1 | Node.js | node:lts |
| account-service | TypeScript | NestJS 11.0.1 | Node.js | node:lts |
| expense-service | PHP 8.2 | Laravel 12.0 | Sanctum 4.0 | php:8.2-fpm |
| analytics-service | Go 1.24 | net/http (stdlib) | — | golang:1.24-alpine -> scratch |
| reporting-service | Python 3.12 | FastAPI 0.128+ | Pydantic 2.12+ | uv:python3.12-bookworm-slim |
| pfms-ui | TypeScript | React 18.3.1 | React Router 6.26 | node |

### 1.2 Infrastructure Components

| Component | Image | Port | Purpose |
|-----------|-------|------|---------|
| Kafka | confluentinc/cp-kafka:7.5.0 | 9092/29092 | Event streaming (KRaft mode, no ZooKeeper) |
| RabbitMQ | rabbitmq:4-management | 5672/15672 | Point-to-point messaging |
| MySQL | — | 3307 | API Gateway user store |
| PostgreSQL | — | 5432 | Budget, Goal, Transaction, Account, Expense |
| MongoDB | — | 3308 | Notification storage |
| Redis | redis | 6379 | Goal service caching + circuit breaker fallback |
| Consul | hashicorp/consul | 8500 | Polyglot service discovery |
| Eureka | Spring Cloud Netflix | 8761 | JVM service discovery |
| Config Server | Spring Cloud Config | 8888 | Git-backed centralized configuration |

### 1.3 Key Libraries Already in Use

| Library | Service | Purpose |
|---------|---------|---------|
| MapStruct | budget-service | Compile-time DTO-to-Entity mapping |
| Resilience4j | goal-service | Circuit breaker + retry (budget-service calls) |
| Caffeine | budget-service | In-process cache (500 entries, 600s TTL) |
| jjwt 0.11.5 | api-gateway | JWT generation/validation |
| Spring Cloud Gateway | api-gateway | Reactive reverse proxy with `lb://` routes |
| ReactFlow 11.7.0 | pfms-ui | Architecture visualization |
| Framer Motion 10.16.4 | pfms-ui | Animation library |
| DaisyUI 4.12.10 | pfms-ui | Tailwind CSS component library |
| Axios 1.6.2 | pfms-ui | HTTP client |

---

## 2. Analytics Service (Go) — Research

### 2.1 Current State
- **File:** `analytics-service/main.go` — 30-line stub HTTP server
- **Endpoints:** `GET /health`, `GET /api/analytics` (returns hardcoded JSON)
- **Dependencies:** `go.mod` with Go 1.24.12, zero external dependencies
- **Dockerfile:** Multi-stage build producing ~10MB scratch image

### 2.2 Recommended Stack for Full Implementation

| Component | Choice | Rationale |
|-----------|--------|-----------|
| HTTP framework | `chi` (v5) or `echo` | Lightweight, idiomatic Go; stdlib-compatible |
| Kafka consumer | `segmentio/kafka-go` | Pure Go, no CGo dependency, connection pooling |
| TimescaleDB driver | `jackc/pgx/v5` | Fastest PostgreSQL driver for Go, native types |
| Structured logging | `rs/zerolog` | Zero-allocation JSON logger |
| Config | `knadh/koanf` | Multi-source config (env, file, consul) |
| OpenTelemetry | `go.opentelemetry.io/otel` | Standard distributed tracing |
| Metrics | `prometheus/client_golang` | Native Prometheus exposition |
| Consul registration | `hashicorp/consul/api` | Official Go client |

### 2.3 Event Consumption Design

**Kafka Topics to consume:**
- `transaction.created` — Store in time-series table
- `budget.created` — Store budget snapshot for comparison
- `goal.milestone.reached` — Store for gamification analytics

**TimescaleDB Hypertable:**
```sql
CREATE TABLE transactions_ts (
  time        TIMESTAMPTZ NOT NULL,
  user_id     TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  type        TEXT NOT NULL,  -- 'INCOME' | 'EXPENSE'
  category    TEXT NOT NULL,
  description TEXT
);
SELECT create_hypertable('transactions_ts', 'time');

-- Continuous aggregate for daily spending
CREATE MATERIALIZED VIEW daily_spending
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS day,
       user_id, category,
       SUM(amount) FILTER (WHERE type = 'EXPENSE') as spent,
       SUM(amount) FILTER (WHERE type = 'INCOME') as earned
FROM transactions_ts
GROUP BY day, user_id, category;
```

### 2.4 API Design

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/spending-by-category` | GET | Spending grouped by category for date range |
| `/api/analytics/income-vs-expense` | GET | Income vs expense time-series |
| `/api/analytics/monthly-summary` | GET | Month-over-month comparison |
| `/api/analytics/category-trends` | GET | Per-category trend lines |
| `/health` | GET | Health check (DB + Kafka consumer status) |
| `/metrics` | GET | Prometheus metrics endpoint |

---

## 3. AI Advisor Service (Python) — Research

### 3.1 Current State
- **Directory:** `ai-advisor-service/` — empty or minimal scaffold
- **PRD Target:** Python + Flask + Claude API for financial Q&A

### 3.2 Recommended Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | FastAPI (not Flask) | Async, auto-OpenAPI, Pydantic validation, matches reporting-service |
| LLM client | `anthropic` SDK | Official Claude API client |
| Prompt management | Jinja2 templates in `prompts/` dir | Separates prompt engineering from code |
| Rate limiting | `slowapi` (built on `limits`) | Per-user rate limiting for cost control |
| Caching | `cachetools` + Redis | Cache categorization results to avoid redundant LLM calls |
| Consul | `python-consul2` | Already used by reporting-service |
| Config | `pydantic-settings` | Env-based config with validation |
| Testing | `pytest` + `respx` (async HTTP mocking) | Mock Claude API responses |

### 3.3 Claude Tool-Use Integration (Agentic)

The AI Advisor can use Claude's tool-use feature to take actions on the user's behalf:

```python
# Tool definitions for Claude API
tools = [
    {
        "name": "get_transactions",
        "description": "Fetch user's transactions for a date range",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "from_date": {"type": "string", "format": "date"},
                "to_date": {"type": "string", "format": "date"},
                "category": {"type": "string"}
            },
            "required": ["user_id"]
        }
    },
    {
        "name": "create_budget",
        "description": "Create a new budget for the user",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "category": {"type": "string", "enum": ["GROCERIES","UTILITIES","RENT","TRAVEL","FOOD","ENTERTAINMENT","DINING","SHOPPING","OTHER"]},
                "amount": {"type": "number"},
                "start_date": {"type": "string", "format": "date"},
                "end_date": {"type": "string", "format": "date"}
            },
            "required": ["user_id", "category", "amount"]
        }
    },
    {
        "name": "create_goal",
        "description": "Create a savings goal",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "title": {"type": "string"},
                "target_amount": {"type": "number"},
                "category": {"type": "string", "enum": ["EMERGENCY_FUND","VACATION","HOME","RETIREMENT","EDUCATION","OTHER"]},
                "deadline": {"type": "string", "format": "date"}
            },
            "required": ["user_id", "title", "target_amount", "category"]
        }
    },
    {
        "name": "contribute_to_goal",
        "description": "Add funds to an existing savings goal",
        "input_schema": {
            "type": "object",
            "properties": {
                "goal_id": {"type": "integer"},
                "amount": {"type": "number"}
            },
            "required": ["goal_id", "amount"]
        }
    },
    {
        "name": "get_budget_status",
        "description": "Get budget vs actual spending for a user",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "month": {"type": "string", "format": "date"}
            },
            "required": ["user_id"]
        }
    }
]
```

### 3.4 Context Building Strategy

```
User prompt: "Am I on track for my vacation fund?"

Context builder gathers:
  1. GET /api/goals?userId={id}&category=VACATION  -> goal details
  2. GET /api/analytics/income-vs-expense?months=3  -> recent trends
  3. GET /v1/api/budgets?userId={id}                -> current budgets

System prompt includes:
  - User's financial snapshot (goals, budgets, recent spending)
  - Guardrails: "Be encouraging, avoid jargon, suggest specific actions"
  - Tool definitions for taking action
```

### 3.5 Cost Optimization
- **Cache-first categorization:** Check rule-based cache before calling LLM
- **Context window management:** Limit financial history to 3 months by default
- **Rate limiting:** 10 req/min per user via slowapi
- **Model selection:** Use Claude Haiku for categorization, Claude Sonnet for complex Q&A

---

## 4. Service Discovery Architecture

### 4.1 Current Dual-Discovery Issue
- **Eureka:** api-gateway, budget-service, goal-service, config-server, discovery-server
- **Consul:** transaction-service, account-service, expense-service, analytics-service, reporting-service

### 4.2 Recommendation: Migrate to Consul-Only

**Rationale:**
- Consul supports all languages natively (Go client, Python client, HTTP API for Java/NestJS)
- Eliminates two separate discovery servers (Eureka + Consul)
- Consul provides KV store, health checking, and DNS — more features than Eureka
- Spring Cloud Consul is production-ready and well-documented

**Migration path:**
1. Add `spring-cloud-starter-consul-discovery` to Java services' `pom.xml`
2. Update `application.yml` in each Java service with Consul config
3. Remove Eureka dependencies from `pom.xml`
4. Update API Gateway routes from `lb://` (Eureka) to Consul-based discovery
5. Retire discovery-server entirely
6. Keep config-server on Spring Cloud Config (Git-backed, not Consul KV)

**Alternative considered:** Keep dual discovery for educational purposes (showing both approaches). The blog posts already document this pattern. Decision: keep dual for now, document Consul-only as future migration.

---

## 5. Event Broker Research

### 5.1 Current Usage
- **Kafka:** Budget-to-Notification pipeline only (1 topic, 1 partition)
- **RabbitMQ:** Transaction-to-Account pipeline only (1 queue)

### 5.2 Expanded Event Strategy

Keep both brokers (they showcase different patterns):

| Pattern | Broker | Why |
|---------|--------|-----|
| Fan-out events (one-to-many) | Kafka | `transaction.created` consumed by analytics, reporting, budget, account services independently |
| Point-to-point commands (one-to-one) | RabbitMQ | `account.create` ensures exactly-one processing |
| Saga coordination | Kafka | `sagaId` correlation across topics for distributed transactions |

### 5.3 Schema Registry Consideration

For polyglot compatibility, use **JSON Schema** (not Avro/Protobuf) stored in `shared/events/`:
- All services can validate without language-specific tooling
- Human-readable for educational purpose
- Trade-off: slightly larger payloads vs. simplicity
- Validation can happen at application startup or in CI pipeline

---

## 6. Frontend Architecture Research

### 6.1 Current State
- React 18.3.1 + React Router 6 + Tailwind + DaisyUI
- Manual `useState`+`useEffect` data fetching in every page
- Axios client with token management in `api.ts`
- No state management library (just AuthContext)
- Framer Motion already available for animations
- ReactFlow for architecture visualization

### 6.2 Recommended Additions

| Library | Purpose | Replaces |
|---------|---------|----------|
| TanStack Query v5 | Server state management, caching, refetching | Manual `useState`+`useEffect` patterns |
| Recharts 2.x | Charts for Reports page | Nothing (new capability) |
| MSW 2.x | API mocking for tests | Nothing (no frontend tests) |
| React Testing Library | Component tests | Nothing (no frontend tests) |

### 6.3 Custom Hooks to Create

```typescript
// useBudgets.ts     -> useQuery(['budgets', month, year], fetchBudgets)
// useGoals.ts       -> useQuery(['goals'], fetchGoals) + useMutation(contributeToGoal)
// useTransactions.ts -> useInfiniteQuery(['transactions'], fetchTransactions)
// useAccounts.ts    -> useQuery(['accounts'], fetchAccounts)
// useAnalytics.ts   -> useQuery(['analytics', dateRange], fetchAnalytics)
```

### 6.4 Component Architecture

```
pfms-ui/src/
  hooks/           <- TanStack Query hooks (new)
  pages/           <- Page components (existing, to be enhanced)
  components/      <- Shared components (existing + new gamification)
  services/api.ts  <- Query functions (refactored from manual fetch)
  context/         <- AuthContext (existing)
```

---

## 7. Database Strategy

### 7.1 Database per Service (Maintained)

| Service | DB Engine | Rationale |
|---------|-----------|-----------|
| api-gateway | MySQL | Already in use; user auth only |
| budget-service | PostgreSQL | Relational + BigDecimal precision |
| goal-service | PostgreSQL | Relational + future joins with contributions |
| transaction-service | PostgreSQL | Strong typing, ACID for financial data |
| account-service | PostgreSQL | Balance integrity requires ACID |
| expense-service | PostgreSQL | Already via Laravel migrations |
| notification-service | MongoDB | Flexible document schema for multi-channel notifications |
| analytics-service | TimescaleDB | Time-series queries, continuous aggregates |
| reporting-service | TimescaleDB (shared read) | CQRS read model, same instance as analytics |
| ai-advisor-service | None (stateless) | All data fetched from other services |

### 7.2 Migration Strategy
- **Java services:** Flyway (`src/main/resources/db/migration/V1__*.sql`)
- **NestJS services:** TypeORM migrations (`src/migrations/`)
- **Laravel:** Already has Artisan migrations (functional)
- **Go:** `golang-migrate/migrate` library + SQL files
- **Python:** Alembic or raw SQL with `asyncpg`

### 7.3 PostgreSQL Consolidation
In development, all PostgreSQL databases can run on a single instance with separate databases:
- `pfms_budgets`, `pfms_goals`, `pfms_transactions`, `pfms_accounts`, `pfms_expenses`
- In production, each service would have its own instance

---

## 8. Testing Strategy Research

### 8.1 Current Test Inventory
- **budget-service:** 5 test classes (BudgetServiceTest, BudgetControllerV1Test, BudgetRepositoryTest, BudgetServiceIntegrationTest, BudgetMapperTest)
- **notification-service:** 2 test classes (NotificationConsumerTest with @EmbeddedKafka, NotificationProducerTest)
- **goal-service:** 3 test classes (BudgetServiceClientIntegrationTest with WireMock, BudgetServiceClientFallbackTest, ExternalBudgetServiceTest)
- **api-gateway:** 1 context loading test
- **All others:** Zero tests

### 8.2 Testing Tools by Language
| Language | Unit | Integration | E2E |
|----------|------|-------------|-----|
| Java | JUnit 5 + Mockito | @EmbeddedKafka, WireMock, Testcontainers | — |
| TypeScript | Jest | Supertest + testcontainers-node | — |
| Go | testing + testify | dockertest | — |
| Python | pytest | respx (async mocking) | — |
| PHP | PHPUnit | Laravel test helpers | — |
| Frontend | React Testing Library + Jest | MSW | Playwright |

### 8.3 Coverage Targets
- Phase 0: 30% (foundation tests for existing code)
- Phase 1-2: 50% (new code ships with tests)
- Phase 3+: 60%+ (all new services have tests from day one)
