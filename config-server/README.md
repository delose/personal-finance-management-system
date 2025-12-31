# Config Server
The Config Server serves as a centralized configuration manager for all microservices.

## Key feature/s
Centralized configuration

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

```bash
curl http://localhost:8888/actuator/health | jq
curl http://localhost:8888/actuator/metrics | jq
curl http://localhost:8888/config-client/default | jq
```

## Verify configs present (propertySources is not empty)

```bash
curl http://localhost:8888/budget-service/dev | jq
curl http://localhost:8888/budget-service/docker | jq
curl http://localhost:8888/api-gateway/dev | jq
curl http://localhost:8888/api-gateway/docker | jq
curl http://localhost:8888/discovery-server/dev | jq
curl http://localhost:8888/discovery-server/docker | jq
```