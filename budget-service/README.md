# Key features
Budget categories, limits, tracking

# Demo steps

## Run Spring Boot app
```shell
./springboot-run.sh dev
```

## Save budget
```shell
curl -i -X POST http://localhost:8082/v1/api/budgets \
   -H 'Content-Type: application/json' \
   -d '{
        "category": "GROCERIES",
        "amount": 450.75,
        "startDate": "2025-01-01",
        "endDate": "2025-01-31",
        "userId": 1
       }'
```

## Get all budgets
```shell
curl localhost:8082/v1/api/budgets
```

## Health
```shell
curl http://localhost:8082/actuator/health | jq
```

## Info
```shell
curl http://localhost:8082/actuator/info |jq
```

## JVM memory usage
```shell
curl http://localhost:8082/actuator/metrics/jvm.memory.used | jq
```

## Enviroment details
```shell
curl http://localhost:8082/actuator/env | jq
```

## Run spring boot
```bash
./springboot-run.sh
```

## Run docker
```bash
./run-docker.sh
```

