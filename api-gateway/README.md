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

## Quick start
1. Dockerized MySQL

### 1-1. Start docker container from MySQL image
```bash
docker run -d -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=apigwdb --name apigwdb -p 3307:3306 mysql:8.0
```
### 1-2. Run interactive SQL CLI
```bash
docker exec -it apigwdb mysql -uroot -psecret apigwdb
```

### 1-3. Stop 
```bash
docker stop apigwdb
```

### 1-4. Remove DB instance
```bash
docker rm apigwdb
```

## 2. Run spring boot
```bash
mvn spring-boot:run 
```
