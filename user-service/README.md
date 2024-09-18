# User Service

The `user-service` is a microservice responsible for managing user data within the Personal Finance Management System (PFMS). It provides endpoints for user registration and retrieval.

## Features

- User Registration
- User Retrieval by Username

## Technologies Used

- Spring Boot
- Spring Data JPA
- H2 Database
- JUnit 5
- Mockito

## Endpoints

- `POST /api/v1/users/register` - Register a new user.
- `GET /api/v1/users/{username}` - Retrieve user details by username.

## Running the Service

1. Ensure your environment is configured to use Java 11 or higher.
2. Run the service using the following command:

    ```bash
    mvn spring-boot:run
    ```

3.	The service will be available at http://localhost:8081.

## Testing

Unit tests are included in the src/test/java directory. To run the tests, use:

    ```bash
    mvn test
    ```
