# Personal Finance Management System (PFMS) - Functional Use Cases

This document outlines the detailed user journeys derived from PRD.md v2.0. Each journey provides implementation-ready specifications aligned with the product requirements.

## 1. One-Command System Setup (Developer Journey)

**Goal**: Enable developers to launch the entire PFMS system with a single command and see a working demo.

**User Actions**:
1. Developer clones repository
2. Developer runs `./run-pfms.sh`
3. Developer waits for services to initialize
4. Developer opens browser to http://localhost:3000

**Expected Outcome**:
1. System starts all infrastructure services (Kafka, RabbitMQ, databases)
2. System launches all microservices with health checks
3. System seeds demo data automatically
4. System opens congratulations page with live architecture visualization
5. All services show "healthy" status in dashboard

**Functional Requirements**:
- ✅ Shell script with Docker Compose orchestration
- ✅ Health check endpoints on all services
- ✅ Demo data seeding script
- ✅ Live architecture visualization (React + D3.js)
- ✅ Service status aggregation in API Gateway
- ✅ Real-time health status updates via WebSocket
- ✅ Error handling for missing dependencies
- ✅ Success confirmation with system URL

## 2. Budget Creation and Management

**Goal**: Enable users to create monthly budgets by category and track spending progress.

**User Actions**:
1. User navigates to "Budgets" section
2. User clicks "Create Budget" button
3. User selects month/year and adds categories with amounts
4. User saves budget

**Expected Outcome**:
1. System displays budget form with common category suggestions
2. System validates amounts (> $0) and period (current/future months)
3. System saves budget to PostgreSQL via budget-service
4. System publishes `budget.created` event to Kafka
5. System shows budget dashboard with progress bars

**Functional Requirements**:
- ✅ Budget period validation (current/future months only)
- ✅ Category amount validation (> $0)
- ✅ Database transaction for atomic save
- ✅ Kafka event publishing (`budget.created`)
- ✅ Progress bar visualization (green/yellow/red)
- ✅ Category suggestions from past budgets
- ✅ Error handling for duplicate budgets
- ✅ Budget rollover on monthly reset

## 3. Transaction Tracking

**Goal**: Enable manual entry of income/expenses with automatic categorization.

**User Actions**:
1. User clicks "Add Transaction" button
2. User enters amount, date, and description
3. User confirms auto-suggested category
4. User saves transaction

**Expected Outcome**:
1. System displays transaction form with date picker
2. System suggests category based on description (ML-based)
3. System validates amount (> $0) and date (not future)
4. System saves to PostgreSQL via transaction-service
5. System publishes to RabbitMQ for account-service
6. System updates budget progress

**Functional Requirements**:
- ✅ Amount validation (> $0)
- ✅ Date validation (not future dates)
- ✅ Category suggestion algorithm
- ✅ Transaction database storage
- ✅ RabbitMQ event publishing
- ✅ Budget progress recalculation
- ✅ Recurring transaction detection
- ✅ Receipt image upload (optional)

## 4. Goal Setting with Streak Tracking

**Goal**: Enable users to create savings goals and build financial habits through streaks.

**User Actions**:
1. User navigates to "Goals" section
2. User clicks "Create Goal" button
3. User enters goal name, target amount, and deadline
4. User completes daily check-in
5. User views streak progress

**Expected Outcome**:
1. System displays goal creation form
2. System validates target amount and deadline (future date)
3. System calculates required monthly savings
4. System saves goal to PostgreSQL via goal-service
5. System shows animated flame for streak counter
6. System triggers confetti at milestones

**Functional Requirements**:
- ✅ Goal validation (future deadline, positive amount)
- ✅ Monthly savings calculation
- ✅ Streak counter with daily check-in
- ✅ Streak freeze (1 per week)
- ✅ Milestone detection (25% increments)
- ✅ Celebration animations (confetti, sounds)
- ✅ Visual progress indicators (thermometer)
- ✅ Goal completion certification

## 5. AI Financial Advisor

**Goal**: Provide plain-English financial guidance through LLM integration.

**User Actions**:
1. User navigates to "Advisor" section
2. User types question in natural language
3. User receives personalized advice
4. User saves helpful responses

**Expected Outcome**:
1. System displays chat interface
2. System sends question to ai-advisor-service
3. System receives Claude API response
4. System displays simple, jargon-free answer
5. System saves conversation history

**Functional Requirements**:
- ✅ Natural language input processing
- ✅ Claude API integration
- ✅ Response simplification algorithm
- ✅ Conversation history storage
- ✅ Rate limiting (5 questions/minute)
- ✅ Response caching for common questions
- ✅ Personalization based on user data
- ✅ Error handling for API failures

## 6. Financial Health Dashboard

**Goal**: Provide one-page overview of financial status with visual analytics.

**User Actions**:
1. User views dashboard on login
2. System shows spending trends
3. User filters by time period
4. User drills down into categories

**Expected Outcome**:
1. System displays overview with key metrics
2. System shows spending trends (month-over-month)
3. System applies time filters dynamically
4. System shows category breakdowns
5. System provides actionable insights

**Functional Requirements**:
- ✅ Real-time data aggregation
- ✅ Chart generation (area, donut, bar)
- ✅ Interactive filter controls
- ✅ Category drill-down capability
- ✅ Insight generation algorithm
- ✅ Comparative period analysis
- ✅ Mobile-responsive design
- ✅ Print/export functionality

## 7. Interactive Architecture Visualization

**Goal**: Show live service topology with real-time health status.

**User Actions**:
1. Developer views landing page
2. System displays service diagram
3. Developer hovers over services
4. Developer sees message flows

**Expected Outcome**:
1. System renders D3.js visualization
2. System shows real-time health status
3. System animates Kafka/RabbitMQ flows
4. System updates status via WebSocket
5. System highlights unhealthy services

**Functional Requirements**:
- ✅ D3.js topology rendering
- ✅ WebSocket for real-time updates
- ✅ Health status aggregation
- ✅ Animated message flow visualization
- ✅ Service metadata tooltips
- ✅ Error state highlighting
- ✅ Zoom/pan controls
- ✅ Legend for messaging patterns

## 8. Streak Gamification System

**Goal**: Motivate users through daily check-ins and achievement badges.

**User Actions**:
1. User completes daily financial check-in
2. System increments streak counter
3. User views growing flame animation
4. User earns badges at milestones

**Expected Outcome**:
1. System tracks daily check-ins
2. System increments streak counter
3. System displays animated flame
4. System awards badges at milestones
5. System provides encouraging messages

**Functional Requirements**:
- ✅ Daily check-in tracking
- ✅ Streak counter persistence
- ✅ Flame animation (SVG-based)
- ✅ Badge award system
- ✅ Milestone celebrations
- ✅ Streak freeze (1 per week)
- ✅ Encouraging restart after breaks
- ✅ Shareable achievement cards

---

## Implementation Checklist

1. **System Setup**: 8 requirements
2. **Budget Management**: 8 requirements
3. **Transaction Tracking**: 8 requirements
4. **Goal Setting**: 8 requirements
5. **AI Advisor**: 8 requirements
6. **Financial Dashboard**: 8 requirements
7. **Architecture Visualization**: 8 requirements
8. **Streak Gamification**: 8 requirements

**Total**: 64 implementation-ready requirements

**Note**: All journeys align with PRD.md v2.0 specifications. Missing details from PRD:
- Specific bank integration requirements (marked as mock in PRD)
- Exact celebration animation specifications
- Detailed error handling scenarios for AI advisor
