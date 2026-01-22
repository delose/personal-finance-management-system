# Personal Finance Management System (PFMS) - Functional Use Cases

This document outlines the detailed user journeys and functional requirements for the Personal Finance Management System (PFMS). Each user journey provides a comprehensive blueprint for implementation, including specific user actions, expected system responses, and technical requirements.

## 1. User Registration and Authentication

**Goal**: Enable users to create accounts, securely log in, and manage their authentication credentials.

### User Journey: New User Registration

**User Actions**:
1. User clicks "Sign Up" button on landing page
2. User enters email address, password, and confirms password
3. User clicks "Create Account" button
4. User receives email verification link
5. User clicks verification link in email

**Expected Outcome**:
1. System displays registration form with validation rules
2. System validates email format and password strength (min 8 chars, special char)
3. System creates user account in database with hashed password
4. System sends verification email with unique token (expires in 24h)
5. System activates account and redirects to login page

**Functional Requirements**:
- ✅ Email format validation (regex pattern)
- ✅ Password strength validation (min 8 chars, 1 special char, 1 number)
- ✅ Unique email verification (database check)
- ✅ BCrypt password hashing (cost factor 12)
- ✅ JWT token generation for email verification
- ✅ Email service integration (SMTP or API)
- ✅ Account status management (pending/active)
- ✅ Error handling for duplicate emails
- ✅ Rate limiting on registration endpoint (5 attempts/hour)

### User Journey: User Login

**User Actions**:
1. User enters email and password on login page
2. User clicks "Login" button
3. User is redirected to dashboard

**Expected Outcome**:
1. System validates credentials against database
2. System generates JWT token with 24h expiration
3. System returns token in HTTP-only secure cookie
4. System redirects to dashboard with authenticated session

**Functional Requirements**:
- ✅ Credential validation against hashed passwords
- ✅ JWT token generation with user claims
- ✅ Secure cookie configuration (HttpOnly, Secure, SameSite)
- ✅ Token refresh mechanism
- ✅ Failed login attempt tracking (lock after 5 attempts)
- ✅ CORS configuration for frontend
- ✅ CSRF protection

### User Journey: Password Recovery

**User Actions**:
1. User clicks "Forgot Password" link
2. User enters email address
3. User receives password reset email
4. User clicks reset link and enters new password
5. User is redirected to login page

**Functional Requirements**:
- ✅ Email existence validation (without revealing if email exists)
- ✅ Time-limited reset token (1 hour expiration)
- ✅ Password reset token single-use
- ✅ New password strength validation
- ✅ Email notification of password change

---

## 2. Budget Creation and Management

**Goal**: Enable users to create, monitor, and manage personal budgets with visual progress tracking.

### User Journey: Create Monthly Budget

**User Actions**:
1. User navigates to "Budgets" section
2. User clicks "Create New Budget" button
3. User selects month and year
4. User adds budget categories with amounts
5. User clicks "Save Budget" button

**Expected Outcome**:
1. System displays budget creation form with common categories
2. System validates all amounts are positive numbers
3. System saves budget to database
4. System publishes `budget.created` event to Kafka
5. System displays budget summary with progress bars

**Functional Requirements**:
- ✅ Budget period validation (current/future months only)
- ✅ Category amount validation (> $0)
- ✅ Total budget calculation
- ✅ Database transaction for atomic save
- ✅ Kafka event publishing (`budget.created`)
- ✅ Budget progress visualization (percentage bars)
- ✅ Category suggestions based on past budgets
- ✅ Error handling for duplicate budgets

### User Journey: Monitor Budget Progress

**User Actions**:
1. User views budget dashboard
2. System shows visual progress for each category
3. User sees warning when approaching limit (80%)
4. User receives notification when limit exceeded

**Expected Outcome**:
1. System calculates spent amount per category
2. System displays progress bars with color coding
3. System shows warning indicators at 80% usage
4. System publishes `budget.limit.warning` at 90%
5. System publishes `budget.limit.exceeded` at 100%

**Functional Requirements**:
- ✅ Real-time budget calculation from transactions
- ✅ Progress bar visualization (green/yellow/red)
- ✅ Threshold-based notifications (80%, 90%, 100%)
- ✅ Kafka event publishing for warnings
- ✅ Budget rollover handling (monthly reset)
- ✅ Historical budget comparison
- ✅ Export budget data (CSV/PDF)

---

## 3. Expense Tracking and Categorization

**Goal**: Enable users to log expenses manually or automatically, with smart categorization.

### User Journey: Manual Expense Entry

**User Actions**:
1. User clicks "Add Expense" button
2. User enters amount, date, and description
3. User selects or confirms auto-suggested category
4. User clicks "Save Expense"

**Expected Outcome**:
1. System displays expense form with date picker
2. System suggests category based on description
3. System validates amount and date
4. System saves expense to database
5. System updates budget progress
6. System publishes `expense.created` event

**Functional Requirements**:
- ✅ Amount validation (> $0)
- ✅ Date validation (not future dates)
- ✅ Category suggestion algorithm (ML-based)
- ✅ Transaction database storage
- ✅ Budget progress recalculation
- ✅ Kafka event publishing
- ✅ Receipt image upload (optional)
- ✅ Recurring expense detection

### User Journey: Automatic Transaction Import

**User Actions**:
1. User links bank account (mock integration)
2. System imports transactions nightly
3. User reviews imported transactions
4. User confirms or recategorizes transactions

**Expected Outcome**:
1. System displays account linking interface
2. System imports transactions via mock API
3. System applies categorization rules
4. System flags uncertain categorizations
5. System updates budget progress

**Functional Requirements**:
- ✅ Bank API integration (mock implementation)
- ✅ Secure credential storage (encrypted)
- ✅ Nightly import scheduler
- ✅ Transaction deduplication
- ✅ Categorization confidence scoring
- ✅ User override capability
- ✅ Import history tracking
- ✅ Error handling for API failures

---

## 4. Financial Goal Setting and Tracking

**Goal**: Enable users to set savings goals and track progress with visual indicators.

### User Journey: Create Savings Goal

**User Actions**:
1. User navigates to "Goals" section
2. User clicks "Create Goal" button
3. User enters goal name, target amount, and deadline
4. User selects funding source (budget category)
5. User clicks "Save Goal"

**Expected Outcome**:
1. System displays goal creation form
2. System validates target amount and deadline
3. System calculates required monthly savings
4. System saves goal to database
5. System displays goal progress dashboard

**Functional Requirements**:
- ✅ Goal validation (future deadline, positive amount)
- ✅ Monthly savings calculation
- ✅ Funding source validation
- ✅ Goal progress tracking
- ✅ Milestone identification (25%, 50%, 75%, 100%)
- ✅ Visual progress indicators (circular progress bars)
- ✅ Deadline countdown display
- ✅ Goal priority setting

### User Journey: Track Goal Progress

**User Actions**:
1. User views goal dashboard
2. System shows progress toward each goal
3. User sees milestone celebrations
4. User receives recommendations if behind schedule

**Expected Outcome**:
1. System calculates current progress percentage
2. System displays visual progress indicators
3. System triggers celebrations at milestones
4. System provides catch-up recommendations
5. System publishes `goal.milestone.reached` events

**Functional Requirements**:
- ✅ Progress percentage calculation
- ✅ Visual progress rendering
- ✅ Milestone detection (25% increments)
- ✅ Celebration animations/notification
- ✅ Catch-up calculation algorithm
- ✅ Kafka event publishing
- ✅ Goal completion certification
- ✅ Social sharing capability

---

## 5. Notification System

**Goal**: Provide timely, relevant notifications through multiple channels.

### User Journey: Receive Budget Alert

**User Actions**:
1. User approaches budget limit (80%)
2. System sends notification
3. User views notification in app
4. User dismisses or acts on notification

**Expected Outcome**:
1. System detects budget threshold crossing
2. System generates notification record
3. System delivers notification via preferred channel
4. System marks notification as read/dismissed

**Functional Requirements**:
- ✅ Threshold detection (80%, 90%, 100%)
- ✅ Notification generation with context
- ✅ Multi-channel delivery (email, SMS, in-app)
- ✅ User preference respect (channel, frequency)
- ✅ Notification status tracking
- ✅ Notification history
- ✅ Actionable notification buttons
- ✅ Rate limiting (max 3/day per user)

### User Journey: Customize Notification Preferences

**User Actions**:
1. User navigates to settings
2. User selects notification preferences
3. User saves preferences

**Expected Outcome**:
1. System displays current preferences
2. System validates new preferences
3. System saves preferences to database
4. System applies preferences immediately

**Functional Requirements**:
- ✅ Preference validation
- ✅ Database storage of preferences
- ✅ Immediate application of changes
- ✅ Channel-specific toggles
- ✅ Time-based preferences (quiet hours)
- ✅ Notification type filtering
- ✅ Default preference sets
- ✅ Preference change confirmation

---

## 6. Financial Reporting and Analytics

**Goal**: Provide comprehensive financial insights through reports and visualizations.

### User Journey: Generate Spending Report

**User Actions**:
1. User navigates to reports section
2. User selects date range and categories
3. User clicks "Generate Report"
4. User views and exports report

**Expected Outcome**:
1. System displays report generation form
2. System validates date range
3. System generates report with visualizations
4. System provides export options

**Functional Requirements**:
- ✅ Date range validation
- ✅ Category filter application
- ✅ Data aggregation from transactions
- ✅ Chart generation (bar, pie, line)
- ✅ PDF/CSV export capability
- ✅ Report caching for performance
- ✅ Print-friendly formatting
- ✅ Report sharing (email, download)

### User Journey: View Spending Trends

**User Actions**:
1. User views analytics dashboard
2. System shows spending trends
3. User filters by time period
4. User drills down into categories

**Expected Outcome**:
1. System displays trend visualizations
2. System applies time filters
3. System shows category breakdowns
4. System provides insights

**Functional Requirements**:
- ✅ Trend calculation (monthly, quarterly)
- ✅ Interactive chart controls
- ✅ Category drill-down capability
- ✅ Insight generation algorithm
- ✅ Comparative period analysis
- ✅ Anomaly detection
- ✅ Data export for trends
- ✅ Mobile-responsive charts

---

## 7. User Profile Management

**Goal**: Enable users to manage personal information and preferences.

### User Journey: Update Personal Information

**User Actions**:
1. User navigates to profile settings
2. User updates personal details
3. User saves changes

**Expected Outcome**:
1. System displays current information
2. System validates new information
3. System saves changes to database
4. System confirms update success

**Functional Requirements**:
- ✅ Information validation
- ✅ Database update transaction
- ✅ Change confirmation
- ✅ Audit logging
- ✅ Email change verification
- ✅ Profile picture upload
- ✅ Information change history
- ✅ Sensitive data masking

### User Journey: Manage Security Settings

**User Actions**:
1. User navigates to security settings
2. User enables two-factor authentication
3. User sets up authentication app
4. User confirms setup

**Expected Outcome**:
1. System displays security options
2. System generates QR code for auth app
3. System validates setup code
4. System enables 2FA for account

**Functional Requirements**:
- ✅ 2FA setup flow
- ✅ QR code generation
- ✅ Setup code validation
- ✅ Backup code generation
- ✅ Recovery code display
- ✅ 2FA disable capability
- ✅ Trusted device management
- ✅ Security event logging

---

## 8. External Account Integration

**Goal**: Enable automatic transaction import from bank accounts.

### User Journey: Link Bank Account

**User Actions**:
1. User navigates to account linking
2. User selects bank from list
3. User enters credentials (mock)
4. User confirms linking

**Expected Outcome**:
1. System displays bank selection
2. System validates mock credentials
3. System establishes secure connection
4. System confirms successful linking

**Functional Requirements**:
- ✅ Bank selection interface
- ✅ Mock credential validation
- ✅ Secure credential storage
- ✅ Connection testing
- ✅ Linking confirmation
- ✅ Account status display
- ✅ Multiple account support
- ✅ Connection error handling

### User Journey: Review Imported Transactions

**User Actions**:
1. User views imported transactions
2. User recategorizes if needed
3. User confirms transactions
4. System updates budget

**Expected Outcome**:
1. System displays imported transactions
2. System shows categorization confidence
3. System applies user overrides
4. System updates financial data

**Functional Requirements**:
- ✅ Transaction display with metadata
- ✅ Confidence indicator display
- ✅ Category override capability
- ✅ Bulk confirmation
- ✅ Budget impact preview
- ✅ Import history tracking
- ✅ Duplicate detection
- ✅ Manual transaction addition

---

## Implementation Checklist

Each user journey above includes a comprehensive checklist of functional requirements that can be used for implementation:

1. **Registration**: 9 requirements
2. **Login**: 7 requirements
3. **Password Recovery**: 5 requirements
4. **Budget Creation**: 8 requirements
5. **Budget Monitoring**: 7 requirements
6. **Manual Expense Entry**: 8 requirements
7. **Automatic Import**: 8 requirements
8. **Goal Creation**: 8 requirements
9. **Goal Tracking**: 8 requirements
10. **Budget Alerts**: 8 requirements
11. **Notification Preferences**: 8 requirements
12. **Spending Reports**: 8 requirements
13. **Trend Analysis**: 8 requirements
14. **Profile Updates**: 8 requirements
15. **Security Settings**: 8 requirements
16. **Account Linking**: 8 requirements
17. **Transaction Review**: 8 requirements

**Total Functional Requirements**: 142

These requirements provide a complete blueprint for implementing all user journeys in the PFMS system. Each requirement is specific enough to serve as an implementation task for developers.
