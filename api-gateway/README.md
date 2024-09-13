# API Gateway
The API Gateway serves as the entry point for all clients, routing requests to the appropriate backend services. It can handle authentication, rate limiting, load balancing, and more.

## Running the API Gateway

    ```
    mvn spring-boot:run
    ```

This will start the Config Server on port 8080.

## Run the Tests

    ```
    mvn test
    ```

## Health Check and Monitoring

    ```
    http://localhost:8080/actuator/health
    http://localhost:8080/actuator/metrics
    ```
