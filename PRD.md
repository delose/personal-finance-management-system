# Personal Finance Management System - PRD 2026-2030

**Version:** 2.0  
**Status:** Open Source Reference Architecture

---

## Executive Summary

### Mission
Build the de facto open-source reference architecture for fintech companies while creating a delightful, gamified personal finance app.

### Dual Purpose

**For Developers:**
- Learn microservices architecture hands-on
- Explore polyglot patterns (Java/Node/Go/Python/PHP)
- Study real-world event-driven design
- Run complete system with one command

**For Users:**
- Track finances with zero learning curve
- Build healthy money habits through streaks
- Get AI-powered financial guidance
- Beautiful, Duolingo-inspired UX

### Success Metrics
- 10,000+ GitHub stars by 2027
- Cited as reference architecture in 50+ tech blogs
- 1,000+ active deployments

---

## User Personas

### Developer Dan (Primary)
Mid-level backend developer at fintech startup

**Goals:**
- Understand event-driven architecture
- See polyglot microservices working together
- Get project running in under 10 minutes
- Learn from clean, well-documented code

### Consumer Chris (Secondary)
Young professional, tech-savvy but not financially literate

**Goals:**
- Track spending without spreadsheets
- Understand if financial decisions are smart
- Stay motivated through gamification
- Get simple, jargon-free advice

### Enterprise Eva (Tertiary)
Tech lead evaluating architecture for new fintech product

**Goals:**
- Evaluate microservices patterns
- Assess observability strategies
- Fork and customize for company needs

---

## Core Features

### Priority Legend
- **P0:** MVP (2026 Q1-Q2)
- **P1:** Phase 2 (2026 Q3-Q4)
- **P2:** Future (2027+)

---

## Developer Experience Features

### P0: One-Command Setup
Run ./run-pfms.sh and see congratulations page with all services green. Pre-loaded demo data included.

**Tech:** Shell scripts + Docker Compose + health checks

### P0: Interactive Architecture Visualization
Landing page shows live service topology with real-time health status and animated message flows.

**Tech:** React + D3.js + WebSocket

### P0: Embedded Documentation
Code comments explain architecture decisions. README for each service.

**Tech:** Markdown + MDX

### P1: Pact Contract Testing
Consumer-driven contract tests between all services with CI integration.

**Tech:** Pact + GitHub Actions

### P2: Chaos Engineering Demos
Built-in failure scenarios to demonstrate resilience patterns.

**Tech:** Custom scripts or Chaos Mesh

---

## User-Facing Features

### P0: Budget Management
Create monthly budgets by category, track spending with visual progress bars, receive alerts.

**Tech:** budget-service (Spring Boot) → Kafka → notification-service

### P0: Transaction Tracking
Manual entry of income/expenses with categorization and recurring support.

**Tech:** transaction-service (NestJS) → RabbitMQ → account-service

### P0: Goal Setting
Create savings goals, track progress, celebrate milestones with animations.

**Tech:** goal-service (Spring Boot)

### P0: Streak Gamification
Daily check-in streaks, weekly goal tracking, achievement badges.

**Tech:** Extend goal-service or create streak-service (Go)

### P1: AI Financial Advisor
Ask questions in plain English and get simple, personalized advice.

**Tech:** NEW ai-advisor-service (Python + Claude API)

### P1: Financial Health Dashboard
One-page overview with spending trends, budget health, goal progress.

**Tech:** reporting-service (Python + Flask) + Chart.js

### P1: Expense Analytics
Spending patterns, month-over-month comparisons, predictive insights.

**Tech:** NEW analytics-service (Go)

### P2: Bank Integration (Demo)
Mock integration with Philippine banks for automatic transaction import.

**Tech:** Mock API endpoints + webhooks

### P2: Automated Workflows
n8n workflows for automated rules, alerts, and reports.

**Tech:** n8n + webhook triggers

---

## Technical Architecture

### Service Landscape

| Service | Language | Database | Messaging | Discovery | Status |
|---------|----------|----------|-----------|-----------|--------|
| API Gateway | Spring Boot | MySQL | - | Eureka | Implemented |
| Budget Service | Spring Boot | PostgreSQL | Kafka (producer) | Eureka | Implemented |
| Goal Service | Spring Boot | PostgreSQL | - | Eureka | Implemented |
| Transaction Service | NestJS | PostgreSQL | RabbitMQ (producer) | Consul | Implemented |
| Account Service | NestJS | PostgreSQL | RabbitMQ (consumer) | - | Implemented |
| Expense Service | PHP | PostgreSQL | - | Consul | Implemented |
| Reporting Service | Python + Flask | Read replicas | - | Consul | Implemented |
| Notification Service | Spring Boot | PostgreSQL | Kafka (consumer) | - | Implemented |
| Analytics Service | Go | TimescaleDB | Kafka (consumer) | Consul | NEW |
| AI Advisor Service | Python + Flask | - | - | Consul | NEW |

### Recommended Changes

**Deprecate:**
- user-service (redundant with account-service)

**Add:**
- analytics-service (Go) for spending patterns and predictions
- ai-advisor-service (Python) for LLM-powered financial Q&A

**Enhance:**
- goal-service to handle streak tracking
- All services expose /health and /metrics endpoints
- Standardize logging format

### Messaging Patterns

**Kafka Topics:**
- budget.created
- budget.limit.warning
- transaction.created
- goal.milestone.reached

**RabbitMQ Queues:**
- account.events
- account.balance.updated

---

## UX Principles

### Core Philosophy
Make finance feel like a game, not homework.

### Key Elements

**Streak System**
- Daily check-in counter (prominent on home)
- Streak freeze (1 per week)
- Animated flame grows with longer streaks
- Encouraging restart after breaks

**Celebration Moments**
- Confetti when goals reached
- Success sounds for completing tasks
- Badges for milestones
- Shareable achievement cards

**Visual Progress**
- Budget: horizontal bars (green/yellow/red)
- Goals: thermometer fills up
- Spending: donut charts by category
- Net worth: area chart over time

**Friendly Copy**
- No jargon
- Encouraging tone
- Simple explanations

**Design System**
- Primary: Vibrant blue
- Success: Green
- Warning: Yellow
- Danger: Red
- Smooth animations (200-300ms)

---

## Observability Strategy

### Health Checks (P0)
All services expose /health endpoints. API Gateway aggregates status. React dashboard shows real-time health.

### Metrics (P1)
Prometheus + Grafana for request rate, latency, errors, resource usage.

### Logging (P1)
Structured JSON logging with ELK stack. Correlation IDs across services.

### Alerting (P2)
GoAlert, OneUptime, or Uptime Kuma for service down and high error rates.

---

## Roadmap

### Phase 1: MVP (Q1-Q2 2026)
- One-command setup with congratulations page
- Pre-loaded demo data
- Budget, transaction, goal services working end-to-end
- Streak tracking UI
- Interactive architecture visualization
- Health check dashboard

### Phase 2: Feature Complete (Q3-Q4 2026)
- AI financial advisor integration
- Analytics service (Go) with spending insights
- Financial health dashboard
- Celebration animations
- Pact contract testing
- Prometheus + Grafana observability

### Phase 3: Production-Grade (2027)
- Kubernetes manifests (Helm charts)
- CI/CD pipelines
- ELK stack integration
- Chaos engineering demos
- Bank integration (mock)
- Mobile-responsive refinements
- n8n workflow examples

### Phase 4: Advanced (2027+)
- Service mesh (Istio/Envoy)
- Terraform infrastructure-as-code
- Multi-cloud deployment examples
- Advanced AI features
- Real bank integrations
- Mobile apps (React Native)

---

## Open Source Strategy

### Repository Structure
```
pfms/
├── services/
│   ├── api-gateway/
│   ├── budget-service/
│   ├── analytics-service/     (NEW)
│   └── ai-advisor-service/    (NEW)
├── infrastructure/
├── pfms-ui/
├── docs/
├── scripts/
└── README.md
```

### Community Building
- Launch on Hacker News, Reddit
- Blog series on building fintech with microservices
- Conference talks
- YouTube walkthroughs
- Regular Twitter/X updates

### License
MIT License for maximum permissiveness

---

## Success Criteria

### Developer Adoption
- 10,000+ GitHub stars by 2027
- 1,000+ forks
- Cited in 50+ tech blogs/courses
- Used in university courses
- 10+ enterprise teams using as reference

### Product Quality
- Under 5 minute setup time
- Over 80% test coverage
- Zero critical security vulnerabilities
- All services pass health checks
- Complete documentation

### User Engagement
- 1,000+ weekly active users
- Average 15-day streak
- Under 1% error rate
- Under 500ms p95 response time

---

## Technology Rationale

**Spring Boot:** Industry standard, excellent ecosystem, production-proven

**NestJS:** Modern Node.js with TypeScript, familiar to Spring devs

**Go:** Performance for analytics, different paradigm showcase

**Python:** Best ML/AI ecosystem for reporting and AI services

**PHP:** Legacy integration patterns showcase

**React:** Dominant frontend, huge ecosystem

---

END OF PRD v2.0