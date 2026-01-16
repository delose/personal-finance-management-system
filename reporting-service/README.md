# Reporting service

## Key feature/s
Aggregated insights

## Tech stack
To be written in Python/Flask

## To start, I've generated Python boilerplate `main.py` using below commands
```bash
cd reporting-service
uv init --app

mkdir -p app/domain app/application app/infrastructure app/interfaces

touch app/__init__.py app/domain/__init__.py app/application/__init__.py \
      app/infrastructure/__init__.py app/interfaces/__init__.py
      
mv main.py app/main.py
```

## Dependencies
```bash
uv add "fastapi[standard]"

uv add pydantic python-consul2 aiokafka aio-pika
```

## Start the app
```bash
./start.sh
```

## Smoke tests
- health page is [here](http://localhost:8000/health)
- auto-generated docs page is [here](http://localhost:8000/docs)
