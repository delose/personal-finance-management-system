# Personal Finance Management System (PFMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Microservices](https://img.shields.io/badge/Architecture-Microservices-green.svg)]()

> A comprehensive, polyglot microservices architecture demonstrating event-driven patterns for personal finance management. Built as both a production-ready application and an educational reference for fintech developers.

---

## 🎯 Overview

PFMS is the de facto open-source reference architecture for fintech companies, combining a production-ready personal finance application with an educational showcase of modern microservices patterns. Built with a dual purpose:

**For Developers**: Learn microservices architecture hands-on through a polyglot system (Java, Node.js, Go, Python, PHP) with event-driven patterns, service discovery, and observability.

**For Users**: Track finances with zero learning curve through a gamified, Duolingo-inspired experience featuring streak tracking, achievement badges, and AI-powered financial guidance.

**Key Highlights**:
- 🏗️ **Polyglot Microservices**: 10+ services across 5 languages
- 🔄 **Event-Driven**: Kafka + RabbitMQ messaging patterns
- 🎮 **Gamified UX**: Streak tracking with animated celebrations
- 🤖 **AI Advisor**: Claude-powered financial guidance
- 🚀 **One-Command Setup**: Full system launch with `./run-pfms.sh`
- 📊 **Production Patterns**: Service discovery, health checks, observability

---

## 📖 User Journeys

PFMS provides comprehensive user journeys aligned with PRD.md v2.0:

### Developer Journeys
1. **[One-Command System Setup](use-cases/README.md#1-one-command-system-setup-developer-journey)**
   - Launch entire system with single command
   - Live architecture visualization
   - Health status dashboard

### User Journeys
2. **[Budget Creation and Management](use-cases/README.md#2-budget-creation-and-management)**
   - Monthly budget creation by category
   - Visual progress tracking
   - Threshold alerts

3. **[Transaction Tracking](use-cases/README.md#3-transaction-tracking)**
   - Manual expense/income entry
   - Smart categorization
   - Recurring transaction detection

4. **[Goal Setting with Streak Tracking](use-cases/README.md#4-goal-setting-with-streak-tracking)**
   - Savings goal creation
   - Daily check-in streaks
   - Milestone celebrations

5. **[AI Financial Advisor](use-cases/README.md#5-ai-financial-advisor)**
   - Natural language Q&A
   - Personalized guidance
   - Conversation history

6. **[Financial Health Dashboard](use-cases/README.md#6-financial-health-dashboard)**
   - Spending trends visualization
   - Category breakdowns
   - Actionable insights

7. **[Interactive Architecture Visualization](use-cases/README.md#7-interactive-architecture-visualization)**
   - Live service topology
   - Real-time health status
   - Message flow animation

8. **[Streak Gamification System](use-cases/README.md#8-streak-gamification-system)**
   - Daily check-in tracking
   - Animated progress indicators
   - Achievement badges

For complete implementation specifications, see **[Functional Use Cases](use-cases/README.md)**.

---

## 🏛️ Architecture

```
┌──────────────┐
│  React UI    │  Port 3000
└──────┬───────┘
       │
┌──────▼────────────────────────────────────┐
│  API Gateway (Spring Boot)                │  Port 8080
│  • JWT Authentication                     │
│  • Service Discovery (Eureka)             │
│  • Health Dashboard                       │
└──────┬────────────────────────────────────┘
       │
┌──────┴────────────────────────────────────┐
│           Microservices Layer             │
├───────────────────────────────────────────┤
│                                           │
│  Budget Service     Goal Service          │
│  (Spring Boot)      (Spring Boot)         │
│  PostgreSQL         PostgreSQL            │
│  → Kafka            Eureka                │
│                                           │
│  Transaction Svc    Account Service       │
│  (NestJS)           (NestJS)              │
│  PostgreSQL         PostgreSQL            │
│  → RabbitMQ         ← RabbitMQ            │
│  Consul             Kafka Consumer        │
│                                           │
│  Expense Service    Analytics Service     │
│  (PHP)              (Go)                  │
│  PostgreSQL         TimescaleDB           │
│                                           │
│  Reporting Svc      AI Advisor Service    │
│  (Python/Flask)     (Python/Flask)        │
│                     Claude API            │
│                                           │
│  Notification Service                     │
│  (Spring Boot)                            │
│  ← Kafka Consumer                         │
└───────────────────────────────────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐    ┌────────────────┐
│   Kafka     │    │   RabbitMQ     │
│   Port 9092 │    │   Port 5672    │
└─────────────┘    └────────────────┘

Infrastructure:
• Config Server (Port 8888)
• Eureka Discovery (Port 8761)
• Consul (Port 8500)
• Prometheus + Grafana
• n8n Workflow Automation
```

---

## 🧩 Microservices

### Core Services

| Service | Tech Stack | Port | Database | Messaging | Discovery |
|---------|-----------|------|----------|-----------|-----------|
| **API Gateway** | Spring Boot | 8080 | MySQL | - | Eureka |
| **Budget Service** | Spring Boot | 3001 | PostgreSQL | Kafka (Producer) | Eureka |
| **Goal Service** | Spring Boot | 3002 | PostgreSQL | - | Eureka |
| **Transaction Service** | NestJS | 3003 | PostgreSQL | RabbitMQ (Producer) | Consul |
| **Account Service** | NestJS | 3001 | PostgreSQL | RabbitMQ (Consumer) | - |
| **Expense Service** | PHP | 3004 | PostgreSQL | - | Consul |
| **Reporting Service** | Python/Flask | 3005 | PostgreSQL | - | Consul |
| **Analytics Service** | Go | 3009 | TimescaleDB | Kafka (Consumer) | Consul |
| **AI Advisor Service** | Python/Flask | 3010 | - | - | Consul |
| **Notification Service** | Spring Boot | 3006 | PostgreSQL | Kafka (Consumer) | - |

### Infrastructure Services

- **Config Server** (Port 8888): Centralized configuration management for api-gateway, budget-service, and discovery-server
- **Discovery Server** (Port 8761): Eureka-based service registry
- **Consul Server** (Port 8500): Alternative service discovery for NestJS, PHP, Python, and Go services
- **Message Broker**: RabbitMQ for synchronous event handling
- **Kafka**: Event streaming for budget events, notifications, and analytics

---

## ✨ Features

### For Developers
- 🚀 **One-Command Setup**: Full system launch with demo data
- 📊 **Live Architecture Visualization**: Interactive service topology
- 🧪 **Pre-loaded Demo Data**: Immediate exploration
- 📚 **Production Patterns**: Event-driven, service discovery, observability
- 🧩 **Polyglot Examples**: 5 languages solving similar problems
- 📖 **Comprehensive Documentation**: ADRs and service READMEs

### For Users
- 💰 **Budget Management**: Category-based tracking with visual progress
- 💸 **Transaction Tracking**: Smart categorization and recurring detection
- 🎯 **Goal Setting**: Savings goals with streak motivation
- 🔥 **Streak Gamification**: Daily check-ins with animated celebrations
- 🤖 **AI Financial Advisor**: Plain-English financial guidance
- 📊 **Financial Dashboard**: Spending trends and insights
- 🎨 **Delightful UX**: Confetti, badges, and encouraging messages

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/delose/personal-finance-management-system.git
cd pfms

# Run the entire system
./run-pfms.sh

# Open the application
open http://localhost:3000
```

**That's it!** The script will:
1. Start all infrastructure services (Kafka, RabbitMQ, databases)
2. Launch all microservices
3. Seed demo data
4. Open the congratulations page with live architecture visualization

### Demo Credentials

```
Username: demo@pfms.dev
Password: demo123
```

---

## 🛠️ Available Scripts

```bash
./run-pfms.sh          # Start all services
./stop-pfms.sh         # Stop all services
./reset-demo-data.sh   # Reset to fresh demo data
./health-check.sh      # Check all services health
```

---

## 📡 Service Communication Patterns

### Event-Driven Flows

**Budget Creation Flow:**
```
User → API Gateway → Budget Service
  → Save to PostgreSQL
  → Publish "budget.created" to Kafka
  → Notification Service consumes
  → Save notification
```

**Transaction Recording Flow:**
```
User → API Gateway → Transaction Service
  → Save to PostgreSQL
  → Publish to RabbitMQ
  → Account Service consumes
  → Update account balance
  → Publish "transaction.created" to Kafka
  → Analytics Service consumes
  → Update spending trends
```

### Message Topics

**Kafka Topics:**
- `budget.created` - New budget events
- `budget.limit.warning` - Budget threshold alerts
- `transaction.created` - Transaction events for analytics
- `goal.milestone.reached` - Goal achievement notifications
- `streak.milestone.reached` - Streak achievement events

**RabbitMQ Queues:**
- `account.events` - Transaction to account updates
- `account.balance.updated` - Balance change notifications

---

## 🔐 Security

- JWT-based authentication via API Gateway
- BCrypt password hashing
- CORS configuration
- Security filter chains
- Rate limiting on AI Advisor endpoints

---

## 📊 Observability

### Health Checks

All services expose health endpoints:

```bash
# API Gateway health
curl http://localhost:8080/actuator/health

# Individual service health (via Eureka/Consul)
curl http://localhost:8761/eureka/apps
curl http://localhost:8500/v1/health/service/transaction-service
```

### Monitoring Stack

- **Prometheus**: Metrics collection from all services
- **Grafana**: Dashboards for system health, performance, and business metrics
- **ELK Stack**: Centralized logging (optional)
- **Custom Dashboard**: JVM metrics at `http://localhost:8080/dashboard`

---

## 🗄️ Database Schema

Each service maintains its own database (database-per-service pattern):

- **API Gateway**: User authentication data (MySQL)
- **Budget Service**: Budgets and categories (PostgreSQL)
- **Goal Service**: Financial goals and streaks (PostgreSQL)
- **Transaction Service**: Transaction records (PostgreSQL)
- **Account Service**: Account balances and history (PostgreSQL)
- **Notification Service**: Notification records (PostgreSQL)
- **Analytics Service**: Aggregated spending data (TimescaleDB)

---

## 🧪 Testing

```bash
# Run all tests
./run-tests.sh

# Run tests for specific service
cd budget-service && mvn test
cd transaction-service && npm test
cd analytics-service && go test ./...
```

**Test Coverage:**
- Unit tests for business logic
- Integration tests for messaging
- Contract tests with Pact (coming soon)
- End-to-end tests for critical flows

---

## 📚 Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Service Communication](docs/architecture/messaging.md)
- [API Documentation](docs/api/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Architecture Decision Records](docs/adr/)
- **[Functional Use Cases](use-cases/README.md)** - Detailed user journeys and system flows
- **[Product Requirements](PRD.md)** - Technical specifications and roadmap

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)
- Core microservices architecture
- Event-driven messaging (Kafka + RabbitMQ)
- Service discovery (Eureka + Consul)
- JWT authentication
- Basic UI with budget/transaction/goal features

### 🚧 In Progress (v2.0)
- Analytics service (Go)
- AI financial advisor
- Streak gamification UI
- Interactive architecture visualization
- Pact contract testing

### 📋 Planned (v3.0+)
- Kubernetes deployment (Helm charts)
- Bank integration (mock APIs)
- Mobile app (React Native)
- Advanced AI features (spending predictions)
- Multi-currency support
- Service mesh (Istio)

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Duolingo's gamification approach
- Built for the developer community to learn microservices
- Special thanks to all contributors

---

## 📞 Contact

- **GitHub**: [@delose](https://github.com/delose)
- **Website**: [edsa.tech](https://edsa.tech)
- **Issues**: [GitHub Issues](https://github.com/delose/pfms/issues)

---

## ⭐ Show Your Support

If PFMS helped you learn microservices or build your fintech project, please give it a star! ⭐

Your support helps make this project better for everyone.

---

**Built with ❤️ by developers, for developers**
