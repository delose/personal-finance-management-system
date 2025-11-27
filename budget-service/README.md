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
        "category": "Groceries",
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
