# Expense Service

A Laravel-based microservice for managing expenses in the Personal Finance Management System (PFMS).

## Features

- Expense CRUD operations
- Consul service registration
- Health check endpoints
- Docker support

## Consul Service Registration

This service is automatically registered with Consul when running in production mode.

### Health Check Endpoints

- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`

### Service Discovery

The service is registered with the following details:
- **Service Name**: `expense-service`
- **Service ID**: `expense-service`
- **Tags**: `php`, `laravel`, `api`
- **Address**: `laravel.test` (or your configured APP_URL)
- **Port**: `80`

### Environment Variables

Add these to your `.env` file:
```env
CONSUL_HOST=consul-server
CONSUL_PORT=8500
CONSUL_SERVICE_NAME=expense-service
CONSUL_SERVICE_ID=expense-service
```

## Docker Setup

### Using Docker Compose with Consul

```bash
docker-compose -f docker-compose.consul.yml up -d
```

### Manual Registration

```bash
./register-with-consul.sh
```

## API Endpoints

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/{id}` - Get a specific expense
- `PUT /api/expenses/{id}` - Update an expense
- `DELETE /api/expenses/{id}` - Delete an expense

### Health
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check with database status

## Development

### Setup
```bash
composer install
php artisan key:generate
php artisan migrate
```

### Run Development Server
```bash
php artisan serve
```

### Run Tests
```bash
php artisan test
```

## Docker Development

### Using Sail
```bash
./vendor/bin/sail up
./vendor/bin/sail artisan migrate
```

### Using Custom Docker Compose
```bash
docker-compose up -d
```

## Consul Commands

### Deregister Service
```bash
php artisan consul:deregister
```

### Graceful Shutdown
```bash
php artisan app:shutdown
```

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure database connection
4. Run migrations: `php artisan migrate --force`
5. The service will automatically register with Consul on startup

## Monitoring

### Check Service Health
```bash
curl http://localhost:8500/v1/health/checks/expense-service
```

### Discover Service
```bash
curl http://localhost:8500/v1/catalog/service/expense-service
```

### View in Consul UI
Visit `http://localhost:8500/ui/dc1/services/expense-service`

## Troubleshooting

### Service Not Registering
1. Check Consul server is running: `curl http://localhost:8500/v1/status/leader`
2. Verify environment variables are set correctly
3. Check logs: `php artisan tail` or `docker logs <container>`

### Health Check Failing
1. Ensure `/health` endpoint returns 200
2. Check Consul UI for health status
3. Verify network connectivity between service and Consul

## License

MIT
