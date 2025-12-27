# Cloud Consul:

## Used for
1. Service Discovery, 
2. Health Checking,
3. Distributed Configuration

## Pull from their verified publisher namespace

```bash
docker run -d --name=consul-server -p 8500:8500 hashicorp/consul agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0

```

