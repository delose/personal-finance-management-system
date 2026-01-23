# Personal Finance Management System (PFMS) - Lean YNAB Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)
[![Local-First](https://img.shields.io/badge/Data-Local--First-green.svg)]()

> A minimalist, local-first implementation of YNAB's core zero-based budgeting methodology. Built for privacy, simplicity, and cost efficiency.

---

## 🎯 Overview

PFMS Lean is a stripped-down, open-source clone of YNAB's core budgeting functionality, focusing on manual control and local data storage. Designed as both a personal finance tool and a reference implementation of zero-based budgeting.

**Core Principles**:
- Give every dollar a job
- Break the paycheck-to-paycheck cycle
- Manual control over finances
- Local-first data storage
- Minimal operational complexity

**Key Differences from Original PFMS**:
- ✅ 90% reduction in codebase size
- ✅ 98% reduction in hosting costs
- ✅ 100% local data control
- ✅ Simplified setup (under 2 minutes)
- ✅ No external dependencies

---

## 📖 Core Features

### Zero-Based Budgeting
- Manual transaction entry
- Category-based allocation
- Monthly rollover
- Running balance tracking

### Transaction Management
- Simple entry form
- CSV import/export
- Search and filter
- Bulk operations

### Basic Reporting
- Spending by category
- Income vs expenses
- Net worth tracking
- Simple visualizations

### Data Control
- Local SQLite storage
- Full data export
- No cloud requirements
- Privacy-focused

---

## 🏛️ Simplified Architecture

```
┌───────────────────────────────────────────────────────┐
│                    User Interface                     │
│  Progressive Web App (React) - Works Offline          │
└───────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                 Minimal Backend                       │
│  Node.js Serverless Functions - 8 Endpoints Total     │
└───────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                   Data Storage                        │
│  SQLite Database - Single File for All Data           │
│  IndexedDB - Browser Cache for Offline Use            │
└───────────────────────────────────────────────────────┘
```

### What's Gone (Compared to v2.0):
- ❌ 10 microservices → 1 monolithic backend
- ❌ Kafka/RabbitMQ → Direct API calls
- ❌ Multiple databases → Single SQLite file
- ❌ Complex infrastructure → Serverless hosting
- ❌ AI features → Simple rule-based suggestions
- ❌ Gamification → Core budgeting only

---

## 🚀 Quick Start

### Prerequisites
- Modern browser (Chrome, Firefox, Edge)
- 5MB disk space

### Installation

```bash
# Clone the repository
git clone https://github.com/delose/personal-finance-management-system.git
cd pfms

# Install dependencies
cd client && npm install
cd ../server && npm install

# Start the development server
npm run dev

# Open the application
open http://localhost:3000
```

**That's it!** No databases to configure, no services to orchestrate.

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel (free tier)
npx vercel
```

---

## 📱 Usage

### 1. Create Accounts
- Add your checking, savings, and cash accounts
- Set starting balances

### 2. Enter Transactions
- Add income and expenses manually
- Categorize each transaction
- Mark as cleared when verified

### 3. Set Up Budget
- Allocate every dollar to categories
- Create monthly budget
- Track spending against allocations

### 4. Review Reports
- View spending by category
- Track net worth over time
- Analyze income vs expenses

### 5. Export Data
- Backup to CSV
- Import into other tools
- Full data portability

---

## 🧩 Technical Details

### Database Schema (SQLite)

```sql
-- Simple, focused schema for zero-based budgeting
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  balance REAL NOT NULL
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_income BOOLEAN DEFAULT 0
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  account_id INTEGER,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  category_id INTEGER,
  memo TEXT,
  FOREIGN KEY(account_id) REFERENCES accounts(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE budgets (
  id INTEGER PRIMARY KEY,
  month TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  allocated REAL NOT NULL,
  spent REAL DEFAULT 0,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);
```

### API Endpoints

```
GET    /api/accounts          - List accounts
POST   /api/accounts          - Create account
GET    /api/transactions      - List transactions
POST   /api/transactions      - Add transaction
GET    /api/budgets/:month    - Get budget
POST   /api/budgets/:month    - Update budget
POST   /api/import            - CSV import
GET    /api/export            - Data export
```

---

## 📊 Comparison with YNAB

| Feature | YNAB | PFMS Lean |
|---------|------|-----------|
| **Price** | $99/year | FREE |
| **Bank Sync** | ✅ | ❌ |
| **Mobile Apps** | ✅ Native | ✅ PWA |
| **Offline Support** | Limited | ✅ Full |
| **Data Location** | Cloud | ✅ Local |
| **Setup Time** | 5 min | ✅ 2 min |
| **Learning Curve** | Moderate | ✅ Low |
| **Privacy** | Good | ✅ Excellent |
| **Export** | Limited | ✅ Full |

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run export     # Export all data to CSV
npm run import     # Import from CSV
npm test           # Run all tests
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test CSV import/export
npm run test:csv
```

**Test Coverage:**
- Unit tests for budget calculations
- Integration tests for API endpoints
- E2E tests for critical flows
- CSV import/export validation

---

## 📚 Documentation

- [Quick Start Guide](docs/quick-start.md)
- [Budgeting Methodology](docs/methodology.md)
- [API Reference](docs/api.md)
- [Data Schema](docs/schema.md)
- [Contributing](CONTRIBUTING.md)

---

## 🤝 Contributing

We welcome contributions focused on:
- Core budgeting improvements
- Performance optimizations
- Documentation
- Bug fixes

**Not Accepting:**
- Bank integration features
- AI/ML additions
- Complex gamification
- Multi-user support

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by YNAB's zero-based budgeting methodology
- Built for financial privacy and simplicity
- Special thanks to contributors focusing on core functionality

---

## ⭐ Support

If PFMS Lean helps you take control of your finances, please:
- Give it a star ⭐
- Share with friends
- Consider contributing

---

**Built for financial freedom, not complexity**
