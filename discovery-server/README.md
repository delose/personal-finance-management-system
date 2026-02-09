# Discovery Server
The Discovery Server is a Spring Boot application that acts as a service registry and discovery server for the PFMS application. It uses Eureka for service registration and discovery.

## Key features
Service registration & discovery

## Running the Discovery Server

```bash
mvn spring-boot:run
```

This will start the Discovery Server on port 8761.

## Access Eureka Dashboard

```bash
http://localhost:8761
```

## Run the Tests

```bash
mvn test
```

## Health Check and Monitoring

``` bash
curl http://localhost:8761/actuator/health
curl http://localhost:8761/actuator/metrics 
curl http://localhost:8761/health 
```

## Run dockerized app
```bash
./run-docker.sh
```