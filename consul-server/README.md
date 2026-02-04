# Cloud Consul:

## Used for
1. Service Discovery, 
2. Health Checking,
3. Distributed Configuration

## Pull from their verified publisher namespace

```bash
docker run -d --name=consul-server -p 8500:8500 hashicorp/consul agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0

```

## Test out registered consult clients

```bash
curl http://localhost:8500/v1/agent/service/expense-service-8083
curl http://localhost:8500/v1/agent/service/transaction-service-3002
curl http://localhost:8500/v1/agent/service/goal-service-8084
```
## Deregister using script
Please refer to transaction-service's README
