# Personal Finance Management System (PFMS) - Functional Use Cases

This document outlines the functional use cases of the Personal Finance Management System (PFMS). The PFMS is designed to help users effectively manage their personal finances through features such as budget management, expense tracking, financial goal setting, notifications, reporting, and more.

## 1. User Registration and Authentication

**Description**: Users can sign up for an account on the PFMS platform by providing their personal information, such as username, password, and email. Once registered, users can log in to the platform using their credentials.

**High-Level Details**:
- **User Registration**: New users provide their details, and the system verifies uniqueness (e.g., no duplicate usernames).

    ```
    Client --> API Gateway --> User Service (Register User) --> Database
    ```

- **Login**: Registered users enter their credentials, which are authenticated to grant access to the platform.

    ```
    Client --> API Gateway --> User Service (Authenticate User) --> Database
                    |                           |
                    +-------<--- JWT Token ----<+
    ```

- **Password Management**: Users can reset or change their passwords through the platform.

## 2. Budget Management

**Description**: Users can create, update, and monitor their personal budgets. They can define different budget categories (e.g., groceries, entertainment) and set spending limits.

**High-Level Details**:
- **Create Budget**: Users can define a budget by specifying categories and assigning limits.

    ```
    Client --> API Gateway (Validate JWT) --> Budget Service (Create Budget) --> Database
    ```

- **Update Budget**: Users can modify their budget categories or limits as their financial situation changes.
- **Track Spending**: The system tracks users’ expenditures against their budget and provides alerts if they are approaching or exceeding their limits.

## 3. Expense Tracking

**Description**: Users can log their daily expenses into the system. Each expense is categorized and tracked against the budget.

**High-Level Details**:

    ```
    Client --> API Gateway (Validate JWT) --> Expense Service (Log Expense) --> Database
    ```

- **Log Expense**: Users can enter details of their expenses, including amount, category, date, and a brief description.
- **Categorization**: Expenses are automatically categorized based on user input or predefined rules.
- **Expense History**: Users can view their historical expenses, filter by date or category, and analyze their spending patterns.

## 4. Financial Goals Setting

**Description**: Users can set financial goals, such as saving for a vacation or paying off debt, and the system helps them track their progress.

**High-Level Details**:
- **Set Goals**: Users can define specific financial goals, including the target amount, deadline, and associated savings plan.

    ```
    Client --> API Gateway (Validate JWT) --> Goal Service (Set Goal) --> Database
    ```

- **Progress Tracking**: The system tracks progress towards each goal and provides updates on whether the user is on track or needs to adjust their savings.
- **Recommendations**: The platform can suggest adjustments to users' budgets or savings plans to help them meet their goals.

## 5. Notifications and Alerts

**Description**: The system provides users with timely notifications and alerts about their financial status, such as upcoming bills, low balances, or when they’re close to exceeding their budget.

    ```
    Client --> API Gateway (Validate JWT) --> Notification Service (Retrieve Notifications) --> Database
                    |                           |
                    +------<--- Notifications -<+
    ```

**High-Level Details**:
- **Budget Alerts**: Alerts are sent when users are close to or have exceeded their budget limits.
- **Goal Reminders**: Users receive reminders about their financial goals and upcoming deadlines.
- **Expense Tracking**: Alerts notify users of unusual spending patterns or large transactions.

## 6. Reporting and Analytics

**Description**: Users can generate reports to analyze their financial activities over time. The system provides insights into spending habits, budget adherence, and goal progress.

**High-Level Details**:
- **Generate Reports**: Users can generate custom reports based on various criteria (e.g., monthly spending, category-wise analysis).

    ```
    Client --> API Gateway (Validate JWT) --> Reporting Service (Generate Report) --> Database
                    |                           |
                    +------<--- Report --------<+
    ```

- **Visual Analytics**: The system presents data visually, using charts and graphs, to help users understand their financial behavior.
- **Trend Analysis**: Users can see trends over time, such as increasing or decreasing spending in certain categories.

## 7. User Profile Management

**Description**: Users can manage their personal information and preferences within the platform.

**High-Level Details**:
- **Profile Updates**: Users can update their personal information, such as email, password, or contact details.
- **Preferences**: Users can set preferences for notifications, budget categories, and other personalized settings.
- **Account Security**: Options for enhancing account security, such as two-factor authentication, are available.

## 8. Integration with External Accounts

**Description**: Users can link their bank accounts or credit cards to automatically import transactions into the PFMS system.

**High-Level Details**:
- **Account Linking**: Users can securely link external financial accounts to the PFMS platform.
- **Transaction Import**: The system automatically imports and categorizes transactions from linked accounts.
- **Reconciliation**: Users can reconcile imported transactions with their manually logged expenses to ensure accuracy.

## 9. Data Backup and Recovery

**Description**: The system ensures that users' financial data is securely backed up and can be recovered in case of data loss.

**High-Level Details**:
- **Automatic Backups**: Regular backups of user data are performed automatically by the system.
- **Data Recovery**: In case of data loss, users can restore their information from a backup.