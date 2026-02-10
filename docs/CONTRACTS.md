# PFMS — Data Contracts & Event Schemas
**Version:** 1.0 · **Date:** 2026-02-11

---

## 1. Existing Contracts (As-Is)

### 1.1 Kafka: `notification_requests_topic`

**Producer:** budget-service (`BudgetNotificationProducer.java`)
**Consumer:** notification-service (`NotificationConsumer.java`, group: `notification-service-group`)
**Key:** `userId` (String)
**Serialization:** JSON (StringSerializer key, JsonSerializer value)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "NotificationRequest",
  "description": "Budget notification sent to notification-service via Kafka",
  "type": "object",
  "properties": {
    "id":          { "type": "integer", "description": "Budget ID" },
    "userId":      { "type": "string",  "description": "Owner user ID" },
    "subject":     { "type": "string",  "description": "Notification subject line" },
    "messageBody": { "type": "string",  "description": "Notification body text" },
    "channel":     { "type": "string",  "description": "Delivery channel (e.g. EMAIL, SMS, PUSH)" }
  },
  "required": ["id", "userId", "subject", "messageBody", "channel"]
}
```

**Source files:**
- Producer DTO: `budget-service/src/main/java/com/delose/pfms/budget_service/dto/BudgetNotification.java`
- Consumer DTO: `notification-service/src/main/java/com/delose/pfms/notification_service/dto/NotificationRequest.java`
- MapStruct mapper generates `messageBody`: `"Budget created for category: " + budget.getCategory()`

### 1.2 RabbitMQ: `account_queue`

**Producer:** transaction-service (`app.controller.ts` via `this.accountRMQClient.emit("account-created", payload)`)
**Consumer:** account-service (`app.controller.ts` via `@MessagePattern("account-created")`)
**Queue:** `account_queue` (durable: true)
**Exchange:** default (direct)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AccountCreatedEvent",
  "description": "Account creation event via RabbitMQ (current state — UNTYPED)",
  "type": "object",
  "properties": {
    "pattern": { "const": "account-created" },
    "data": {
      "type": "object",
      "description": "Currently accepts ANY object — no schema enforced"
    }
  },
  "additionalProperties": true
}
```

> **WARNING:** Both producer and consumer use untyped `any`. This contract MUST be formalized in Phase 1.

---

## 2. New Contracts (To-Be)

### 2.1 Kafka: `transaction.created`

**Producer:** transaction-service (NestJS)
**Consumers:** account-service, budget-service, analytics-service, reporting-service
**Key:** `userId` (String)
**Partitions:** 3 (partitioned by userId for per-user ordering)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TransactionCreatedEvent",
  "type": "object",
  "properties": {
    "eventId":     { "type": "string", "format": "uuid", "description": "Unique event ID for idempotency" },
    "eventType":   { "const": "transaction.created" },
    "timestamp":   { "type": "string", "format": "date-time" },
    "source":      { "const": "transaction-service" },
    "sagaId":      { "type": ["string", "null"], "format": "uuid", "description": "Saga correlation ID (null if not part of saga)" },
    "data": {
      "type": "object",
      "properties": {
        "transactionId": { "type": "string", "format": "uuid" },
        "userId":        { "type": "string" },
        "amount":        { "type": "string", "pattern": "^-?\\d+\\.\\d{2}$", "description": "Decimal as string for precision" },
        "type":          { "type": "string", "enum": ["INCOME", "EXPENSE"] },
        "category":      { "type": "string" },
        "description":   { "type": "string" },
        "date":          { "type": "string", "format": "date" },
        "accountId":     { "type": "string", "format": "uuid" },
        "isRecurring":   { "type": "boolean", "default": false },
        "recurringFrequency": { "type": ["string", "null"], "enum": ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "YEARLY", null] }
      },
      "required": ["transactionId", "userId", "amount", "type", "category", "date", "accountId"]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "data"]
}
```

### 2.2 Kafka: `budget.limit.warning`

**Producer:** budget-service (Java)
**Consumers:** notification-service, pfms-ui (future WebSocket)
**Key:** `userId`
**Partitions:** 1

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BudgetLimitWarningEvent",
  "type": "object",
  "properties": {
    "eventId":   { "type": "string", "format": "uuid" },
    "eventType": { "const": "budget.limit.warning" },
    "timestamp": { "type": "string", "format": "date-time" },
    "source":    { "const": "budget-service" },
    "data": {
      "type": "object",
      "properties": {
        "budgetId":       { "type": "integer" },
        "userId":         { "type": "string" },
        "category":       { "type": "string" },
        "budgetedAmount": { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
        "spentAmount":    { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
        "percentUsed":    { "type": "number", "minimum": 0, "maximum": 200 },
        "threshold":      { "type": "string", "enum": ["WARNING_80", "EXCEEDED_100"] },
        "periodStart":    { "type": "string", "format": "date" },
        "periodEnd":      { "type": "string", "format": "date" }
      },
      "required": ["budgetId", "userId", "category", "budgetedAmount", "spentAmount", "percentUsed", "threshold"]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "data"]
}
```

### 2.3 Kafka: `budget.created`

**Producer:** budget-service (Java)
**Consumers:** analytics-service
**Key:** `userId`
**Partitions:** 1

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BudgetCreatedEvent",
  "type": "object",
  "properties": {
    "eventId":   { "type": "string", "format": "uuid" },
    "eventType": { "const": "budget.created" },
    "timestamp": { "type": "string", "format": "date-time" },
    "source":    { "const": "budget-service" },
    "data": {
      "type": "object",
      "properties": {
        "budgetId":  { "type": "integer" },
        "userId":    { "type": "string" },
        "category":  { "type": "string", "enum": ["GROCERIES","UTILITIES","RENT","TRAVEL","FOOD","ENTERTAINMENT","DINING","SHOPPING","OTHER"] },
        "amount":    { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
        "startDate": { "type": "string", "format": "date" },
        "endDate":   { "type": "string", "format": "date" }
      },
      "required": ["budgetId", "userId", "category", "amount", "startDate", "endDate"]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "data"]
}
```

### 2.4 Kafka: `goal.milestone.reached`

**Producer:** goal-service (Java)
**Consumers:** notification-service, analytics-service, pfms-ui (future WebSocket)
**Key:** `userId`
**Partitions:** 1

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "GoalMilestoneReachedEvent",
  "type": "object",
  "properties": {
    "eventId":   { "type": "string", "format": "uuid" },
    "eventType": { "const": "goal.milestone.reached" },
    "timestamp": { "type": "string", "format": "date-time" },
    "source":    { "const": "goal-service" },
    "data": {
      "type": "object",
      "properties": {
        "goalId":        { "type": "integer" },
        "userId":        { "type": "string" },
        "goalTitle":     { "type": "string" },
        "category":      { "type": "string", "enum": ["EMERGENCY_FUND","VACATION","HOME","RETIREMENT","EDUCATION","OTHER"] },
        "targetAmount":  { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
        "currentAmount": { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
        "milestone":     { "type": "string", "enum": ["25_PERCENT", "50_PERCENT", "75_PERCENT", "100_PERCENT"] },
        "percentComplete": { "type": "number" }
      },
      "required": ["goalId", "userId", "goalTitle", "targetAmount", "currentAmount", "milestone"]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "data"]
}
```

### 2.5 RabbitMQ: `account.events` (replaces untyped `account_queue`)

**Producer:** transaction-service
**Consumer:** account-service
**Queue:** `account.events` (durable: true)
**Routing patterns:** `account.create`, `account.balance.debit`, `account.balance.credit`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AccountEvent",
  "type": "object",
  "oneOf": [
    {
      "title": "AccountCreateCommand",
      "properties": {
        "pattern":   { "const": "account.create" },
        "eventId":   { "type": "string", "format": "uuid" },
        "timestamp": { "type": "string", "format": "date-time" },
        "data": {
          "type": "object",
          "properties": {
            "userId":   { "type": "string" },
            "name":     { "type": "string" },
            "type":     { "type": "string", "enum": ["CHECKING", "SAVINGS", "CREDIT"] },
            "currency": { "type": "string", "default": "PHP", "pattern": "^[A-Z]{3}$" }
          },
          "required": ["userId", "name", "type"]
        }
      }
    },
    {
      "title": "BalanceUpdateCommand",
      "properties": {
        "pattern":   { "type": "string", "enum": ["account.balance.debit", "account.balance.credit"] },
        "eventId":   { "type": "string", "format": "uuid" },
        "timestamp": { "type": "string", "format": "date-time" },
        "sagaId":    { "type": ["string", "null"], "format": "uuid" },
        "data": {
          "type": "object",
          "properties": {
            "accountId":     { "type": "string", "format": "uuid" },
            "amount":        { "type": "string", "pattern": "^\\d+\\.\\d{2}$" },
            "transactionId": { "type": "string", "format": "uuid" },
            "description":   { "type": "string" }
          },
          "required": ["accountId", "amount", "transactionId"]
        }
      }
    }
  ]
}
```

### 2.6 Kafka: `account.balance.updated` (Saga response)

**Producer:** account-service
**Consumers:** goal-service (saga step 3), reporting-service
**Key:** `userId`
**Partitions:** 3

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AccountBalanceUpdatedEvent",
  "type": "object",
  "properties": {
    "eventId":   { "type": "string", "format": "uuid" },
    "eventType": { "const": "account.balance.updated" },
    "timestamp": { "type": "string", "format": "date-time" },
    "source":    { "const": "account-service" },
    "sagaId":    { "type": ["string", "null"], "format": "uuid" },
    "data": {
      "type": "object",
      "properties": {
        "accountId":       { "type": "string", "format": "uuid" },
        "userId":          { "type": "string" },
        "previousBalance": { "type": "string", "pattern": "^-?\\d+\\.\\d{2}$" },
        "newBalance":      { "type": "string", "pattern": "^-?\\d+\\.\\d{2}$" },
        "changeAmount":    { "type": "string", "pattern": "^-?\\d+\\.\\d{2}$" },
        "changeType":      { "type": "string", "enum": ["DEBIT", "CREDIT"] },
        "transactionId":   { "type": "string", "format": "uuid" }
      },
      "required": ["accountId", "userId", "newBalance", "changeAmount", "changeType"]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "data"]
}
```

---

## 3. REST API Contracts

### 3.1 Transaction Service — New Endpoints

```yaml
# POST /transactions
CreateTransactionDto:
  userId:              string (required)
  amount:              string (decimal, required, pattern: "^\d+\.\d{2}$")
  type:                string (required, enum: INCOME | EXPENSE)
  category:            string (required)
  description:         string (optional)
  date:                string (required, format: date)
  accountId:           string (required, format: uuid)
  isRecurring:         boolean (optional, default: false)
  recurringFrequency:  string (optional, enum: DAILY | WEEKLY | BIWEEKLY | MONTHLY | YEARLY)

# GET /transactions?from=&to=&category=&type=&cursor=&limit=
TransactionQueryDto:
  from:     string (optional, format: date)
  to:       string (optional, format: date)
  category: string (optional)
  type:     string (optional, enum: INCOME | EXPENSE)
  cursor:   string (optional, opaque cursor)
  limit:    integer (optional, default: 20, max: 100)

# Response envelope
TransactionResponseDto:
  id:                 string (uuid)
  userId:             string
  amount:             string (decimal)
  type:               string (enum)
  category:           string
  description:        string | null
  date:               string (date)
  accountId:          string (uuid)
  isRecurring:        boolean
  recurringFrequency: string | null
  createdAt:          string (date-time)
  updatedAt:          string (date-time)

PaginatedResponse<T>:
  data:       T[]
  nextCursor: string | null
  hasMore:    boolean
```

### 3.2 Account Service — New Endpoints

```yaml
# GET /accounts/:id
AccountResponseDto:
  id:       string (uuid)
  userId:   string
  name:     string
  type:     string (enum: CHECKING | SAVINGS | CREDIT)
  balance:  string (decimal)
  currency: string (ISO 4217)

# GET /accounts/:id/balance-history?from=&to=&granularity=
BalanceHistoryResponseDto:
  accountId:   string (uuid)
  granularity: string (enum: DAILY | WEEKLY | MONTHLY)
  dataPoints:
    - date:    string (date)
      balance: string (decimal)
```

### 3.3 Goal Service — Redesigned Endpoints

```yaml
# POST /api/goals
CreateGoalDto:
  userId:       string (required)
  title:        string (required, max: 100)
  description:  string (optional, max: 500)
  targetAmount: string (required, decimal, positive)
  deadline:     string (optional, format: date)
  priority:     string (optional, enum: LOW | MEDIUM | HIGH, default: MEDIUM)
  category:     string (required, enum: EMERGENCY_FUND | VACATION | HOME | RETIREMENT | EDUCATION | OTHER)

# POST /api/goals/:id/contribute
ContributeDto:
  amount:        string (required, decimal, positive)
  transactionId: string (optional, uuid — links to the funding transaction)

# Response
GoalResponseDto:
  id:              integer
  userId:          string
  title:           string
  description:     string | null
  targetAmount:    string (decimal)
  currentAmount:   string (decimal)
  deadline:        string | null (date)
  priority:        string (enum)
  status:          string (enum: ACTIVE | PAUSED | COMPLETED)
  category:        string (enum)
  percentComplete: number (0-100)
  createdAt:       string (date-time)
  updatedAt:       string (date-time)
```

### 3.4 Analytics Service — New Endpoints

```yaml
# GET /api/analytics/spending-by-category?userId=&from=&to=
SpendingByCategoryResponse:
  userId:    string
  period:    { from: date, to: date }
  categories:
    - category: string
      amount:   string (decimal)
      percent:  number

# GET /api/analytics/income-vs-expense?userId=&from=&to=&granularity=
IncomeVsExpenseResponse:
  userId:      string
  granularity: string (DAILY | WEEKLY | MONTHLY)
  dataPoints:
    - date:    string
      income:  string (decimal)
      expense: string (decimal)
      net:     string (decimal)

# GET /api/analytics/monthly-summary?userId=&months=
MonthlySummaryResponse:
  userId: string
  months:
    - month:           string (YYYY-MM)
      totalIncome:     string (decimal)
      totalExpense:    string (decimal)
      netSavings:      string (decimal)
      topCategory:     string
      budgetAdherence: number (percent)
```

### 3.5 AI Advisor Service — New Endpoints

```yaml
# POST /api/advisor/ask
AskRequest:
  userId:  string (required)
  message: string (required, max: 1000)

AskResponse:
  reply:           string
  suggestedActions:
    - action: string (enum: CREATE_BUDGET | CREATE_GOAL | CONTRIBUTE_TO_GOAL | REVIEW_SPENDING)
      params: object
  sources:         string[] (services consulted)

# POST /api/advisor/categorize
CategorizeRequest:
  description: string (required)
  amount:      string (optional, decimal)

CategorizeResponse:
  category:   string
  confidence: number (0-1)
  reasoning:  string

# POST /api/advisor/health-score
HealthScoreRequest:
  userId: string (required)

HealthScoreResponse:
  score:   integer (0-100)
  grade:   string (A | B | C | D | F)
  factors:
    - name:       string
      score:      integer
      suggestion: string
  summary: string
```

---

## 4. Event Envelope Standard

All events (Kafka and RabbitMQ) MUST use this envelope:

```json
{
  "eventId":   "uuid-v4 -- unique per event for idempotency",
  "eventType": "domain.action -- e.g. transaction.created",
  "timestamp": "ISO 8601 UTC -- e.g. 2026-02-11T08:30:00Z",
  "source":    "service-name -- e.g. budget-service",
  "sagaId":    "uuid-v4 or null -- correlation ID for distributed transactions",
  "data":      { "...domain-specific payload..." }
}
```

### 4.1 Backward Compatibility

The existing `notification_requests_topic` does NOT use this envelope. Migration plan:
1. Add envelope fields alongside existing flat structure in producer
2. Consumer reads both formats (envelope-first, flat-fallback)
3. Once all producers use envelope format, remove flat-fallback code

---

## 5. Topic & Queue Registry

| Name | Broker | Partitions | Producers | Consumers |
|------|--------|------------|-----------|-----------|
| `notification_requests_topic` | Kafka | 1 | budget-service | notification-service |
| `transaction.created` | Kafka | 3 | transaction-service | account-service, budget-service, analytics-service, reporting-service |
| `budget.created` | Kafka | 1 | budget-service | analytics-service |
| `budget.limit.warning` | Kafka | 1 | budget-service | notification-service |
| `goal.milestone.reached` | Kafka | 1 | goal-service | notification-service, analytics-service |
| `account.balance.updated` | Kafka | 3 | account-service | goal-service, reporting-service |
| `account.events` | RabbitMQ | — | transaction-service | account-service |

### 5.1 Consumer Groups

| Group ID | Service | Topics |
|----------|---------|--------|
| `notification-service-group` | notification-service | `notification_requests_topic`, `budget.limit.warning`, `goal.milestone.reached` |
| `analytics-service-group` | analytics-service | `transaction.created`, `budget.created`, `goal.milestone.reached` |
| `reporting-service-group` | reporting-service | `transaction.created`, `account.balance.updated` |
| `budget-service-group` | budget-service | `transaction.created` |
| `account-service-group` | account-service | `transaction.created` |

### 5.2 Serialization Standards

| Broker | Key Serializer | Value Serializer | Notes |
|--------|---------------|-----------------|-------|
| Kafka (Java) | StringSerializer | JsonSerializer | `spring.json.trusted.packages: "*"` |
| Kafka (NestJS) | String | JSON.stringify | Via `@nestjs/microservices` Kafka transport |
| Kafka (Go) | []byte (string) | []byte (JSON) | Via `segmentio/kafka-go` |
| Kafka (Python) | str | json.dumps | Via `aiokafka` |
| RabbitMQ (NestJS) | — | JSON (NestJS default) | Via `@nestjs/microservices` RMQ transport |
