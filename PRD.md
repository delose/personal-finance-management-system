# Personal Finance Management System - PRD 2026-2030

**Version:** 3.0
**Status:** Lean YNAB Clone MVP

---

## Executive Summary

### Mission
Provide the core zero-based budgeting experience at 1/10th the operational cost of YNAB, focusing on manual control and simplicity.

### Core Value Proposition
- Give every dollar a job (YNAB's core methodology)
- Break the paycheck-to-paycheck cycle
- Manual control over finances with minimal overhead
- Local-first approach for privacy and cost efficiency

### Success Metrics
- Under $5/month hosting cost per 1,000 users
- 90% feature parity with YNAB's core budgeting functionality
- Under 2GB memory footprint for entire stack
- Setup time under 2 minutes
- 80% reduction in operational complexity

---

## User Personas

### Budgeting Beginner (Primary)
- First-time budgeter trying to get control of finances
- Living paycheck-to-paycheck
- Needs simple, manual system without complexity
- Comfortable with manual data entry

### Cost-Conscious User (Secondary)
- Wants YNAB functionality without subscription
- Unwilling to pay $99/year for budgeting software
- Comfortable with manual entry and CSV imports
- Values privacy and local data control

### Privacy-Focused User (Tertiary)
- Prefers local data storage over cloud
- Wants to avoid third-party bank integrations
- Values simplicity and transparency

---

## Core Features

### Priority Legend
- **P0:** MVP (Immediate implementation)
- **P1:** Phase 2 (Post-MVP enhancements)
- **P2:** Future (Nice-to-have features)

### P0: Zero-Based Budgeting (Core YNAB Methodology)
- Manual transaction entry with simple form
- CSV import/export functionality
- Category-based allocation (give every dollar a job)
- Monthly budget rollover
- Running balance tracking
- Simple category management

### P0: Transaction Management
- Manual entry form (date, amount, category, memo)
- Bulk CSV upload with standard format
- Basic categorization with dropdown
- Search and filter by date/category
- Transaction editing and deletion
- Running balance calculation

### P0: Budget Tracking
- Monthly budget creation
- Category allocation tracking
- Spent vs. allocated visualization
- Simple progress bars
- Overspending warnings
- Month-to-month comparison

### P1: Simple Reporting
- Monthly spending by category (bar chart)
- Income vs expense pie chart
- Net worth tracking over time
- Spending trends (3-month view)
- Category breakdown reports

### P1: Data Management
- Local data backup/export
- Import from other budgeting tools
- Data validation and error handling
- Simple search functionality
- Bulk edit operations

### P2: Enhanced Features
- Recurring transaction templates
- Multiple currency support
- Basic goal tracking
- Simple debt payoff calculator
- Mobile-responsive UI improvements

### Non-Goals (Explicitly Excluded)
- Bank API syncing (Plaid/Yodlee)
- Mobile apps (native iOS/Android)
- Multi-user support
- AI/ML features
- Real-time collaboration
- Complex gamification
- Investment tracking
- Tax calculations

---

## Technical Architecture

### Simplified Stack

```
┌───────────────────────────────────────────────────────┐
│                    User Interface                     │
│  Progressive Web App (React) - Local-First Approach   │
└───────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                 Monolithic Backend                    │
│  Node.js (Serverless Functions) - Minimal API Surface │
└───────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                   Data Storage                        │
│  SQLite (Primary) + IndexedDB (Browser Cache)        │
│  Single database file for all user data               │
└───────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│                   Hosting                             │
│  Vercel/Netlify (Serverless) - Minimal Cost           │
└───────────────────────────────────────────────────────┘
```

### Key Architectural Changes from v2.0:

1. **Monolithic Backend**: Single Node.js service replacing 10+ microservices
2. **Local-First Storage**: SQLite primary storage with IndexedDB browser cache
3. **Serverless Functions**: Minimal API endpoints (5-10 total)
4. **No Message Brokers**: Direct API calls, no Kafka/RabbitMQ
5. **Simplified Database**: Single SQLite file with 3-5 tables
6. **Reduced Infrastructure**: No service discovery, config servers, or complex orchestration

### Database Schema (SQLite)

```sql
-- Core tables for zero-based budgeting
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  is_income BOOLEAN DEFAULT 0,
  hidden BOOLEAN DEFAULT 0
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  category_id INTEGER,
  memo TEXT,
  cleared BOOLEAN DEFAULT 0,
  FOREIGN KEY(account_id) REFERENCES accounts(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL, -- YYYY-MM format
  category_id INTEGER NOT NULL,
  allocated REAL NOT NULL DEFAULT 0,
  spent REAL DEFAULT 0,
  FOREIGN KEY(category_id) REFERENCES categories(id),
  UNIQUE(month, category_id)
);

CREATE TABLE metadata (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### API Endpoints (Simplified)

```
GET    /api/accounts          - List all accounts
POST   /api/accounts          - Create new account
GET    /api/transactions      - List transactions (with filters)
POST   /api/transactions      - Create transaction
PUT    /api/transactions/:id  - Update transaction
DELETE /api/transactions/:id  - Delete transaction
GET    /api/budgets/:month    - Get budget for specific month
POST   /api/budgets/:month    - Update budget allocations
POST   /api/import            - CSV import
GET    /api/export            - Data export
GET    /api/reports/spending  - Spending report
```

---

## Implementation Plan

### Phase 1: Core Budgeting (4 weeks)
- SQLite schema implementation
- Transaction CRUD operations
- Budget allocation system
- Monthly rollover logic
- Basic UI for data entry
- Local storage integration

### Phase 2: Import/Export (2 weeks)
- CSV import functionality
- Data export/backup system
- Error handling for imports
- Data validation

### Phase 3: Basic Reporting (2 weeks)
- Spending by category charts
- Income vs expense visualization
- Net worth tracking
- Simple reporting UI

### Phase 4: Polish (2 weeks)
- UI refinements
- Performance optimization
- Documentation
- Testing and bug fixes

---

## Cost Analysis

### Current Architecture Costs (v2.0):
- $500+/month for cloud services
- Complex DevOps requirements
- High maintenance overhead
- Multiple database instances
- Message broker costs

### New Architecture Costs (v3.0):
- **Hosting**: $5/month (Vercel hobby tier)
- **Database**: $0 (SQLite - no server required)
- **API Calls**: $0 (serverless functions within free tier)
- **Maintenance**: Minimal (single codebase)
- **Total**: Under $10/month for entire system

### Cost Savings: 98%+ reduction

---

## Technology Rationale

**Frontend: React (PWA)**
- Progressive Web App for installable experience
- Works offline with IndexedDB caching
- Single codebase for all devices
- Familiar to most developers

**Backend: Node.js (Serverless)**
- Minimal API surface
- Easy to deploy and scale
- Low cold-start times
- Huge ecosystem

**Database: SQLite**
- Zero configuration
- Single file storage
- ACID compliant
- Works in browser (via SQL.js)
- No server required

**Hosting: Vercel/Netlify**
- Free tier sufficient
- Easy deployment
- Serverless functions included
- Global CDN

---

## Migration Path from v2.0

1. **Data Consolidation**
   - Export data from all microservices
   - Transform into simplified SQLite schema
   - Create migration scripts

2. **Backend Simplification**
   - Replace microservices with serverless functions
   - Implement minimal API endpoints
   - Remove all messaging infrastructure

3. **Frontend Rebuild**
   - Simplify UI to focus on core budgeting
   - Implement PWA features
   - Add local-first data handling

4. **Infrastructure Reduction**
   - Remove Kafka, RabbitMQ, Eureka, Consul
   - Eliminate multiple databases
   - Simplify to single hosting provider

5. **Feature Removal**
   - Remove AI advisor
   - Remove gamification
   - Remove architecture visualization
   - Remove complex reporting

---

## Success Criteria

### Technical Success
- Under 2 minute setup time
- Under 10 API endpoints total
- Single database file
- Under 5MB total codebase size
- 90% test coverage

### User Success
- 80% of YNAB core functionality
- Under 1 second response times
- Works completely offline
- Simple data export/import
- Intuitive for first-time budgeters

### Cost Success
- Under $10/month hosting
- Zero database costs
- Minimal maintenance time
- No third-party API dependencies
- Open source with MIT license

---

## Open Source Strategy

### Simplified Repository Structure
```
pfms/
├── client/          # React PWA
├── server/          # Node.js serverless functions
├── database/        # SQLite schema and migrations
├── scripts/         # Setup and utility scripts
├── docs/            # Minimal documentation
└── README.md        # Simplified setup instructions
```

### Community Focus
- Position as "YNAB for developers"
- Emphasize local-first privacy
- Simple contribution process
- Clear architecture documentation
- Focus on core budgeting needs

### License
MIT License for maximum adoption

---

## Roadmap

### v3.0 (Current - MVP)
- Core zero-based budgeting
- Manual transaction entry
- CSV import/export
- Basic reporting
- Local-first storage

### v3.1 (Q1 2027)
- Recurring transaction templates
- Improved mobile experience
- Data validation enhancements
- Performance optimizations

### v3.2 (Q2 2027)
- Multiple budget support
- Simple goal tracking
- Enhanced reporting
- Backup automation

### Future Considerations
- Encrypted cloud sync (optional)
- Multi-currency support
- Basic mobile apps (React Native)
- Plugin system for extensions

---

## Key Differences from YNAB

| Feature | YNAB | PFMS Lean Clone |
|---------|------|-----------------|
| Bank Sync | ✅ Paid | ❌ Manual only |
| Mobile Apps | ✅ Native | ❌ PWA only |
| Multi-User | ✅ | ❌ Single user |
| AI Features | ✅ | ❌ Rule-based only |
| Price | $99/year | FREE (MIT) |
| Data Location | Cloud | Local-first |
| Setup Complexity | Simple | Simpler |
| Offline Support | Limited | Full |

---

END OF PRD v3.0 - Lean YNAB Clone
