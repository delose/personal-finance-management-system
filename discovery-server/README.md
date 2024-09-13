# Discovery Server
The Discovery Server is a Spring Boot application that acts as a service registry and discovery server for the PFMS application. It uses Eureka for service registration and discovery.

## Running the Discovery Server

    ```
    mvn spring-boot:run
    ```

This will start the Discovery Server on port 8761.

## Access Eureka Dashboard

    ```
    http://localhost:8761
    ```

## Run the Tests

    ```
    mvn test
    ```

## Health Check and Monitoring

    ```
    http://localhost:8761/actuator/health
    http://localhost:8761/actuator/metrics
    ```
