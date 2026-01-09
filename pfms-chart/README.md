# PFMS Helm Chart

## Prerequisites
Install helm `brew install helm`

## Verify Helm
```bash
helm version
```

## Umbrella Structure
There are two types of charts
1. Umbrella Chart (pfms/pfms-chart/Chart.yaml)
2. Sub-charts (pfms/pfms-chart/charts/**/Chart.yaml)

## Generated with below command
```bash
helm create pfms-chart
```

## Generate Sub-charts
```bash
cd pfms-chart/charts
helm create <service name e.g. budget-service>
```

## Manually search latest dependencies version
### Copy Chart version into the pfms/pfms-chart/pfms-system/Chart.yaml
```bash
helm search repo bitnami/rabbitmq --versions | head -2
helm search repo bitnami/consul --versions | head -2
helm search repo bitnami/kafka --versions | head -2
helm search repo bitnami/postgresql --versions | head -2
```

## Download dependencies
```bash
cd pfms-chart/charts/<service name>
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm dependency update
```

## Build and sync dependencies
```bash
helm dependency build .
```

## Verify the combined output of all microservices
```bash
helm template .
```

## Deploys defined charts together
```bash
helm upgrade --install pfms-prod . -n pfms-namespace --create-namespace
```

## Verify Deployment Status
```bash
kubectl get all -n pfms-namespace
```

## View Service Endpoints
```bash
kubectl get svc -n pfms-namespace
```

## Management Workflow (The "Umbrella" Power)
```bash
helm rollback pfms-prod 1 -n pfms-namespace
```

## Check release history
```bash
helm history pfms-prod -n pfms-namespace
```