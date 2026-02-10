# PFMS — Requirements Specification
**Version:** 1.0 · **Baseline:** PRD v2.0 · **Date:** 2026-02-11

---

## 1. Current State Audit (4.3 / 10)

### 1.1 Implemented Features

| Service | Endpoints | Persistence | Events | Discovery | Tests |
|---------|-----------|-------------|--------|-----------|-------|
| API Gateway | `POST /auth/signup`, `POST /auth/login`, `GET /users/me`, `GET /users/`, `GET /dashboard` | MySQL (users table, ddl-auto) | — | Eureka | 1 context test |
| Budget Service | `GET/POST /v1/api/budgets`, `GET /v1/api/budgets/{id}`, `GET /v1/api/budgets/categories` | PostgreSQL (H2 dev, ddl-auto) | Kafka producer (`notification_requests_topic`) | Eureka | 5 test classes |
| Goal Service | `POST/GET/PUT/DELETE /api/goals`, `GET /api/goals/{id}` | PostgreSQL (H2 dev, ddl-auto) | — | Eureka + Consul | 3 test classes (WireMock, Resilience4j) |
| Notification Service | Kafka consumer only (no REST) | MongoDB (notifdb) | Kafka consumer (`notification_requests_topic`) | Consul | 2 test classes (@EmbeddedKafka) |
| Transaction Service | `GET /health`, `GET /`, `POST /account` | **None** (no TypeORM, no DB) | RMQ producer (`account_queue`) | Consul | 0 real tests |
| Account Service | `GET /health`, `@MessagePattern("account-created")` | **None** (no TypeORM, no DB) | RMQ consumer (`account_queue`) | — | 0 real tests |
| Expense Service | `GET/POST/PUT/DELETE /api/expenses` | PostgreSQL (Laravel migrations) | — | Consul | 0 custom tests |
| Analytics Service | `GET /health`, `GET /api/analytics` | **None** (stub JSON response) | — | — | 0 tests |
| Reporting Service | `GET /health` | **None** | — | Consul | 0 tests |
| AI Advisor Service | **Empty** | — | — | — | — |

### 1.2 Entity Model Gaps

**Current Goal entity** — missing fintech fields:
```java
// CURRENT: title, description, completed (boolean), createdAt
// NEEDED:  userId, targetAmount (BigDecimal), currentAmount (BigDecimal),
//          deadline (LocalDate), priority (enum), status (enum),
//          category (EMERGENCY_FUND|VACATION|HOME|RETIREMENT|EDUCATION)
```

**Current User entity** — missing RBAC:
```java
// CURRENT: id, fullName, email, password, createdAt, updateAt
// NEEDED:  roles (Set<Role>), preferences (JSON), currency, timezone
```

**Transaction entity** — does not exist. Service only relays to RMQ.

**Account entity** — does not exist. Service only logs RMQ messages.

### 1.3 Infrastructure Gaps

| Gap | Current | Required |
|-----|---------|----------|
| Secrets | Hardcoded in Git (`jwt.secret`, `guest:guest`, DB passwords) | `.env` + Docker secrets |
| Validation | Zero `@Valid`/`@NotBlank` annotations, NestJS uses `any` types | Jakarta Bean Validation, class-validator |
| DB Migrations | `ddl-auto=update` everywhere | Flyway (Java), TypeORM migrations (NestJS) |
| Testing | 11 test files / 181 source files (6% ratio) | 60%+ coverage target |
| CI/CD | None | GitHub Actions matrix build |
| Docker | 4 separate `docker-compose.yml` files, no unified orchestration | Single root `docker-compose.yml` with profiles |
| Logging | `System.out.println`, `console.log` | Structured JSON (logback, pino, zerolog) |
| Tracing | None | OpenTelemetry + Jaeger |
| Monitoring | None | Prometheus + Grafana |

---

## 2. Requirements by Domain

### 2.1 Security & Auth (SEC)

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| SEC-01 | Externalize all secrets to environment variables | As a dev, I can clone the repo without exposing production secrets | P0 |
| SEC-02 | Create `.env.example` documenting all required env vars | As a dev, I know exactly what env vars to set | P0 |
| SEC-03 | Move JWT from localStorage to HTTP-only cookies | As a user, my token is not accessible to XSS attacks | P0 |
| SEC-04 | Add CORS origins as config properties (not hardcoded) | As a dev, I can configure allowed origins per environment | P0 |
| SEC-05 | Add role-based access control (USER, ADMIN) | As an admin, I can access admin-only endpoints | P1 |
| SEC-06 | Rate-limit auth endpoints (5 req/min per IP) | As a user, brute-force attacks are mitigated | P1 |

### 2.2 Input Validation (VAL)

| ID | Requirement | Affected Service | Priority |
|----|-------------|------------------|----------|
| VAL-01 | Add `@NotBlank`, `@Email`, `@Size` to `RegisterUserDto` | api-gateway | P0 |
| VAL-02 | Add `@NotNull`, `@Positive` to `Budget` entity fields | budget-service | P0 |
| VAL-03 | Create `GoalRequestDto`/`GoalResponseDto` (stop accepting `@RequestBody Goal`) | goal-service | P0 |
| VAL-04 | Add `class-validator` + global `ValidationPipe` to NestJS services | transaction-service, account-service | P0 |
| VAL-05 | Create `StoreExpenseRequest`/`UpdateExpenseRequest` FormRequest classes | expense-service | P0 |
| VAL-06 | Replace `$request->all()` with validated fields in `ExpenseController.php` update | expense-service | P0 |

### 2.3 Database & Persistence (DB)

| ID | Requirement | Priority |
|----|-------------|----------|
| DB-01 | Add Flyway to all Spring Boot services; create `V1__init.sql` per service | P0 |
| DB-02 | Change `ddl-auto=update` to `validate` in all configs | P0 |
| DB-03 | Add TypeORM + PostgreSQL to transaction-service with migrations | P0 |
| DB-04 | Add TypeORM + PostgreSQL to account-service with migrations | P0 |
| DB-05 | Add database seeding scripts (`scripts/seed/`) with demo data | P1 |

### 2.4 Transaction Service (TXN) — Currently: stub

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| TXN-01 | `Transaction` entity with: id, userId, amount (decimal), type (INCOME/EXPENSE), category, description, date, isRecurring, recurringFrequency, createdAt | As a user, I can record income and expenses | P0 |
| TXN-02 | CRUD endpoints: `POST/GET/PUT/DELETE /transactions` | As a user, I can manage my transactions | P0 |
| TXN-03 | Filtering by date range, category, type | As a user, I can find specific transactions | P0 |
| TXN-04 | Cursor-based pagination | As a dev, pagination scales with large datasets | P0 |
| TXN-05 | Emit `transaction.created` to Kafka AND `account-created` to RMQ | As a system, downstream services react to transactions | P0 |
| TXN-06 | `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionQueryDto` with class-validator | As a dev, inputs are validated before persistence | P0 |
| TXN-07 | Recurring transaction cron job (`@Cron`) | As a user, recurring bills auto-generate transactions | P1 |

### 2.5 Account Service (ACCT) — Currently: stub

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| ACCT-01 | `Account` entity: id, userId, name, type (CHECKING/SAVINGS/CREDIT), balance (decimal), currency | As a user, I can see my account balances | P0 |
| ACCT-02 | `BalanceHistory` entity for time-series tracking | As a user, I can see balance trends | P1 |
| ACCT-03 | On `account-created` RMQ event, create account and initialize balance | As a system, accounts are created when users register | P0 |
| ACCT-04 | On `transaction.created` Kafka event, update balance (debit/credit) | As a system, balances reflect real transactions | P0 |
| ACCT-05 | `GET /accounts/:id/balance`, `GET /accounts/:id/balance-history` | As a user, I can check my balance via API | P0 |

### 2.6 Goal Service Redesign (GOAL)

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| GOAL-01 | Add fields: userId, targetAmount (BigDecimal), currentAmount, deadline, priority (LOW/MED/HIGH), status (ACTIVE/PAUSED/COMPLETED), category (enum) | As a user, goals have financial targets | P0 |
| GOAL-02 | Remove `completed` boolean; use `status` enum | As a dev, status is richer than a boolean | P0 |
| GOAL-03 | `POST /api/goals/:id/contribute` — add to currentAmount | As a user, I can contribute toward a goal | P0 |
| GOAL-04 | Emit `goal.milestone.reached` Kafka event at 25/50/75/100% thresholds | As a system, milestones trigger notifications and UI celebrations | P1 |
| GOAL-05 | Create `GoalRequestDto`, `GoalResponseDto`, `GoalProgressDto` | As a dev, API contracts are explicit | P0 |

### 2.7 Budget vs. Actual (BVA)

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| BVA-01 | Budget service subscribes to `transaction.created` Kafka topic | As a system, budgets know about actual spending | P1 |
| BVA-02 | New `BudgetSpending` table: budgetId, category, periodStart, periodEnd, totalSpent | As a user, I see how much I actually spent per budget | P1 |
| BVA-03 | `GET /v1/api/budgets` response includes `spent` and `remaining` fields | As a user, I see budget vs actual at a glance | P1 |
| BVA-04 | Emit `budget.limit.warning` at 80% and `budget.exceeded` at 100% | As a user, I'm warned before overspending | P1 |

### 2.8 Analytics Service (ANLYT) — Currently: stub

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| ANLYT-01 | Consume `transaction.created` Kafka events | As a system, analytics has real-time data | P1 |
| ANLYT-02 | Store in TimescaleDB with time-series optimizations | As a dev, time-range queries are fast | P1 |
| ANLYT-03 | `GET /api/analytics/spending-by-category?from=&to=` | As a user, I see spending breakdowns | P1 |
| ANLYT-04 | `GET /api/analytics/income-vs-expense?from=&to=` | As a user, I see income vs expense trends | P1 |
| ANLYT-05 | `GET /api/analytics/monthly-summary` | As a user, I see month-over-month comparisons | P1 |

### 2.9 AI Advisor Service (AI)

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| AI-01 | `POST /api/advisor/ask` — Natural language Q&A with user's financial context | As a user, I can ask "Am I on track for my vacation fund?" | P1 |
| AI-02 | `POST /api/advisor/categorize` — LLM-based transaction categorization | As a system, ambiguous transactions get smart categories | P1 |
| AI-03 | `POST /api/advisor/health-score` — Financial health score (0-100) | As a user, I have a single number showing my financial health | P1 |
| AI-04 | Rate limiting (10 req/min per user) to control LLM costs | As an operator, API costs are predictable | P1 |
| AI-05 | Agentic planning: "Save $5000 for vacation by June" creates goal, calculates savings, suggests budget adjustments | As a user, the AI takes action on my behalf | P2 |
| AI-06 | Define Claude tool-use functions mapping to PFMS endpoints: `create_budget()`, `create_goal()`, `get_transactions()`, `contribute_to_goal()` | As a dev, the AI agent has typed tool definitions | P2 |

### 2.10 Reporting Service (RPT) — Currently: stub

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| RPT-01 | Consume Kafka events and build materialized views (CQRS read side) | As a system, reports are pre-aggregated | P1 |
| RPT-02 | `GET /api/reports/spending-trends` | As a user, I see spending trends over time | P1 |
| RPT-03 | `GET /api/reports/budget-utilization` | As a user, I see a heatmap of budget usage | P1 |
| RPT-04 | `GET /api/reports/net-worth` | As a user, I see my net worth trajectory | P2 |

### 2.11 Observability (OBS)

| ID | Requirement | Priority |
|----|-------------|----------|
| OBS-01 | Structured JSON logging: logback (Java), pino (NestJS), zerolog (Go), python-json-logger | P0 |
| OBS-02 | Correlation ID propagation via `X-Correlation-ID` header across HTTP, Kafka, RMQ | P0 |
| OBS-03 | OpenTelemetry distributed tracing with Jaeger backend | P1 |
| OBS-04 | Prometheus metrics + Grafana dashboards (RED metrics, Kafka lag, RMQ depth) | P1 |
| OBS-05 | Centralized logging with Grafana Loki + Promtail | P1 |

### 2.12 Frontend (FE)

| ID | Requirement | User Story | Priority |
|----|-------------|------------|----------|
| FE-01 | Replace `useState`+`useEffect` fetch pattern with TanStack Query | As a dev, data fetching is declarative with caching | P0 |
| FE-02 | Implement GoalsPage: goal CRUD, thermometer progress, milestone badges, contribute action | As a user, I can manage goals visually | P0 |
| FE-03 | Implement ReportsPage: spending donut, income vs expense area chart, budget heatmap | As a user, I see financial dashboards | P1 |
| FE-04 | Gamification UI: StreakCounter (animated flame), AchievementBadge, CelebrationOverlay (confetti) | As a user, finance feels like a game | P1 |
| FE-05 | Frontend tests: React Testing Library + MSW for BudgetPage, GoalsPage, AuthContext, api.ts | As a dev, frontend changes are safe | P1 |

### 2.13 DevEx & Infrastructure (DX)

| ID | Requirement | Priority |
|----|-------------|----------|
| DX-01 | Unified root `docker-compose.yml` with profiles: `infra`, `backend`, `observability` | P0 |
| DX-02 | `Taskfile.yml` (go-task): `task dev`, `task test`, `task lint`, `task db:migrate`, `task db:seed` | P0 |
| DX-03 | OpenAPI/Swagger on all HTTP services | P1 |
| DX-04 | CI/CD: GitHub Actions matrix build (mvn, npm, go, pytest, php artisan) + Docker publish | P0 |
| DX-05 | Shared event contracts: `pfms-common` Maven module + JSON Schema definitions in `shared/events/` | P1 |

### 2.14 Kubernetes & Helm (K8S)

| ID | Requirement | Priority |
|----|-------------|----------|
| K8S-01 | Replace placeholder nginx images with real service images in all subcharts | P1 |
| K8S-02 | Add ConfigMap/Secret templates, PVC for databases | P1 |
| K8S-03 | Proper liveness/readiness probes pointing to actual `/health` endpoints | P1 |
| K8S-04 | `values-dev.yaml` and `values-prod.yaml` for environment overrides | P1 |

---

## 3. Gap Summary (5.7 / 10 missing)

| Category | Weight | Gap |
|----------|--------|-----|
| Transaction CRUD | 1.0 | Service is a stub — no entity, no DB, no real endpoints |
| Account Balances | 0.8 | Service only logs — no entity, no DB, no balance tracking |
| Goal Redesign | 0.5 | Entity has no financial fields (targetAmount, currentAmount, deadline) |
| Budget vs Actual | 0.5 | Budget service doesn't know about actual spending |
| Security | 0.5 | Hardcoded secrets, localStorage JWT, no validation, no RBAC |
| Analytics | 0.4 | Stub Go service with no real data pipeline |
| Reporting | 0.4 | Stub Python service with no materialized views |
| AI Advisor | 0.4 | Empty directory |
| Frontend | 0.4 | Goals/Reports are "Coming Soon", no TanStack Query |
| Testing | 0.3 | 6% test ratio vs 60%+ target |
| CI/CD | 0.3 | No pipeline |
| Observability | 0.2 | No structured logging, tracing, or metrics |
| **Total** | **5.7** | |
