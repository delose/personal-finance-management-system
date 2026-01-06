# Kafka stream messaging

## Determine the network ID
```bash
docker inspect global-service-kafka -f '{{range $net,$v := .NetworkSettings.Networks}}{{$net}}{{end}}'
```

## Kafka UI
Go to this [page](http://localhost:9094/ui/clusters/local-cluster/brokers)

## Ensure Kafka is running
```bash
docker ps | grep global-service-kafka
```

## Ensure network exists
```bash
docker network ls | grep pfms-network
```

## To see if budget-service can reach global-service-kafka
```bash
docker run --rm --network pfms-network alpine nc -vz global-service-kafka 29092
```
1. What this does: Starts a tiny alpine container (which has nc), joins it to your pfms-network, checks the connection, and then deletes itself (--rm).
2. Success looks like: global-service-kafka (172.x.x.x:29092) open

## Portainer
Navigate to [here](http://localhost:9000/#!/init/admin) and create ADMIN password

## Check via Portainer Console
1. Go to Containers -> click on budget-service.
2. Click the Console icon (>_).
3. Choose /bin/sh or /bin/bash and click Connect.
4. Try using curl if nc is missing:
```bash
curl -v global-service-kafka:29092
```

## Network visualization (Portainer)
Navigate [here](http://localhost:9000/#!/3/docker/networks)