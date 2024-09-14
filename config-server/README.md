# Config Server
The Config Server serves as a centralized configuration manager for all microservices.

## Running the Config Server

    ```
    mvn spring-boot:run
    ```

This will start the Config Server on port 8888.

## Run the Tests

    ```
    mvn test
    ```

## Health Check and Monitoring

    ```
    http://localhost:8888/actuator/health
    http://localhost:8888/actuator/metrics
    http://localhost:8888/config-client/default
    
    ```
