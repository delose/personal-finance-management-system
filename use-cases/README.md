# Personal Finance Management System (PFMS) - Lean YNAB Clone Use Cases

This document outlines the simplified user journeys for the Lean YNAB Clone, focusing exclusively on core zero-based budgeting functionality.

## 1. Quick Setup and First Budget

**Goal**: Enable users to start budgeting within 2 minutes of installation.

**User Actions**:
1. User opens application
2. User creates first account (checking/savings)
3. User enters starting balance
4. User creates initial budget categories
5. User allocates funds to categories

**Expected Outcome**:
1. System displays simple account creation form
2. System validates balance (> $0)
3. System shows category suggestions (rent, groceries, etc.)
4. System ensures every dollar is allocated
5. System shows budget overview with progress bars

**Functional Requirements**:
- ✅ Simple account creation form
- ✅ Balance validation
- ✅ Default category suggestions
- ✅ Allocation validation (sum = balance)
- ✅ Visual budget overview
- ✅ Error handling for invalid inputs
- ✅ Success confirmation

---

## 2. Manual Transaction Entry

**Goal**: Enable users to manually record income and expenses.

**User Actions**:
1. User navigates to "Transactions" section
2. User clicks "Add Transaction" button
3. User enters date, amount, category, and memo
4. User saves transaction

**Expected Outcome**:
1. System displays simple transaction form
2. System validates amount (> $0) and date (not future)
3. System saves to SQLite database
4. System updates account balance
5. System updates budget category spending

**Functional Requirements**:
- ✅ Transaction form with date picker
- ✅ Amount validation (> $0)
- ✅ Date validation (not future)
- ✅ Category dropdown with suggestions
- ✅ Database transaction for atomic save
- ✅ Balance update calculation
- ✅ Budget spending update
- ✅ Error handling for invalid entries

---

## 3. Budget Management

**Goal**: Enable users to create and manage monthly budgets.

**User Actions**:
1. User navigates to "Budget" section
2. User selects month
3. User allocates funds to categories
4. User saves budget

**Expected Outcome**:
1. System displays budget grid for selected month
2. System shows available funds to allocate
3. System validates allocations (sum = available)
4. System saves budget to database
5. System shows visual progress indicators

**Functional Requirements**:
- ✅ Monthly budget grid view
- ✅ Available funds calculation
- ✅ Allocation validation
- ✅ Database save operation
- ✅ Progress bar visualization
- ✅ Category allocation suggestions
- ✅ Error handling for over-allocation
- ✅ Previous month rollover

---

## 4. CSV Import/Export

**Goal**: Enable users to import/export transaction data.

**User Actions**:
1. User navigates to "Import/Export" section
2. User selects CSV file for import
3. User maps CSV columns to fields
4. User confirms import
5. User exports data for backup

**Expected Outcome**:
1. System displays import form
2. System validates CSV format
3. System shows column mapping interface
4. System imports transactions atomically
5. System generates export file
6. System provides success confirmation

**Functional Requirements**:
- ✅ CSV file upload
- ✅ Format validation
- ✅ Column mapping interface
- ✅ Transaction batch import
- ✅ Error handling for invalid data
- ✅ Export generation
- ✅ Data validation reports
- ✅ Backup confirmation

---

## 5. Simple Reporting

**Goal**: Provide basic financial insights through simple reports.

**User Actions**:
1. User navigates to "Reports" section
2. User selects report type
3. User views spending breakdown
4. User filters by time period

**Expected Outcome**:
1. System displays report selection
2. System generates spending by category
3. System shows simple bar chart
4. System applies time filters
5. System calculates totals

**Functional Requirements**:
- ✅ Report type selection
- ✅ Spending by category calculation
- ✅ Simple chart generation
- ✅ Time period filtering
- ✅ Total calculations
- ✅ Data export option
- ✅ Print-friendly format
- ✅ Error handling for no data

---

## Implementation Checklist

1. **Quick Setup**: 8 requirements
2. **Transaction Entry**: 8 requirements
3. **Budget Management**: 8 requirements
4. **CSV Import/Export**: 8 requirements
5. **Simple Reporting**: 8 requirements

**Total**: 40 focused requirements (vs 64 in v2.0)

**Note**: All journeys focus exclusively on core zero-based budgeting. Complex features from v2.0 (AI, gamification, architecture visualization) have been removed to maintain simplicity and cost efficiency.

---

## Key Differences from v2.0

### Removed Complexity:
- ❌ Bank integration
- ❌ AI financial advisor
- ❌ Gamification systems
- ❌ Architecture visualization
- ❌ Multi-service orchestration
- ❌ Complex messaging patterns
- ❌ Advanced analytics

### Added Simplicity:
- ✅ Single SQLite database
- ✅ Minimal API surface
- ✅ Local-first storage
- ✅ Focused UI for budgeting
- ✅ Simple CSV import/export
- ✅ Basic reporting only
- ✅ Reduced infrastructure

### Performance Targets:
- Under 2 minute setup
- Under 1 second response times
- Works completely offline
- Under 5MB total size
- Zero external dependencies

---

## Migration from v2.0

For users migrating from the complex v2.0 architecture:

1. **Data Export**: Export data from all v2.0 services
2. **Data Transformation**: Convert to simplified schema
3. **Import**: Use CSV import functionality
4. **Verification**: Validate all transactions and budgets
5. **Cleanup**: Remove old infrastructure

**Note**: Some v2.0 features (AI advice, gamification) will not be available in the lean version. Focus is on core budgeting functionality.

---

## Development Priorities

1. **Core Budgeting**: Transaction entry, category management, budget allocation
2. **Data Portability**: CSV import/export, backup/restore
3. **Simple Reporting**: Basic charts and calculations
4. **Performance**: Fast load times, offline support
5. **Reliability**: Data validation, error handling

All development efforts focus on maintaining the simplicity and cost efficiency of the lean architecture while delivering core YNAB functionality.
