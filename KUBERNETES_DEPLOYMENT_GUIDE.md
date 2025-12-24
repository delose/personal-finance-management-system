# Kubernetes Deployment Guide for PFMS
## Terraform + Helm + Kubernetes Best Practices

This guide walks you through deploying your microservices architecture to Kubernetes (GKE) using Terraform for infrastructure and Helm for application deployment.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Terraform Setup](#terraform-setup)
3. [Helm Charts Structure](#helm-charts-structure)
4. [Kubernetes Best Practices Implementation](#kubernetes-best-practices-implementation)
5. [Deployment Steps](#deployment-steps)

---

## Prerequisites

### 1. Install Required Tools

```bash
# Install Terraform
brew install terraform

# Install Helm
brew install helm

# Install Google Cloud SDK (for GKE)
brew install google-cloud-sdk

# Install kubectl (Kubernetes CLI)
brew install kubectl
```

### 2. GCP Setup

```bash
# Login to GCP
gcloud auth login
gcloud auth application-default login

# Set your project
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable iam.googleapis.com
```

---

## Terraform Setup

### Step 1: Create Terraform Directory Structure

```bash
mkdir -p terraform/{modules,environments/{dev,prod}}
cd terraform
```

### Step 2: Create `terraform/main.tf` (Root Configuration)

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Optional: Use remote state backend (recommended for production)
  # backend "gcs" {
  #   bucket = "your-terraform-state-bucket"
  #   prefix = "pfms/terraform/state"
  # }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Get GKE cluster details for Kubernetes provider
data "google_container_cluster" "primary" {
  name     = module.gke.cluster_name
  location = var.region
}

# Configure Kubernetes provider to use GKE cluster
provider "kubernetes" {
  host                   = "https://${data.google_container_cluster.primary.endpoint}"
  token                  = data.google_client_config.provider.access_token
  cluster_ca_certificate = base64decode(data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}

# Configure Helm provider
provider "helm" {
  kubernetes {
    host                   = "https://${data.google_container_cluster.primary.endpoint}"
    token                  = data.google_client_config.provider.access_token
    cluster_ca_certificate = base64decode(data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
  }
}

data "google_client_config" "provider" {}

# Create GKE Cluster
module "gke" {
  source = "./modules/gke"

  project_id     = var.project_id
  region         = var.region
  cluster_name   = var.cluster_name
  node_count     = var.node_count
  machine_type   = var.machine_type
  disk_size_gb   = var.disk_size_gb
}

# Create Namespace
resource "kubernetes_namespace" "pfms" {
  metadata {
    name = var.namespace
    labels = {
      environment = var.environment
      managed-by  = "terraform"
    }
  }

  depends_on = [module.gke]
}
```

### Step 3: Create `terraform/variables.tf`

```hcl
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
  default     = "pfms-cluster"
}

variable "namespace" {
  description = "Kubernetes namespace for PFMS"
  type        = string
  default     = "pfms"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "node_count" {
  description = "Number of nodes in the node pool"
  type        = number
  default     = 3
}

variable "machine_type" {
  description = "Machine type for nodes"
  type        = string
  default     = "e2-medium"
}

variable "disk_size_gb" {
  description = "Disk size for nodes (GB)"
  type        = number
  default     = 50
}
```

### Step 4: Create `terraform/outputs.tf`

```hcl
output "cluster_name" {
  value       = module.gke.cluster_name
  description = "GKE cluster name"
}

output "cluster_endpoint" {
  value       = module.gke.cluster_endpoint
  description = "GKE cluster endpoint"
  sensitive   = true
}

output "cluster_ca_certificate" {
  value       = module.gke.cluster_ca_certificate
  description = "GKE cluster CA certificate"
  sensitive   = true
}

output "namespace" {
  value       = kubernetes_namespace.pfms.metadata[0].name
  description = "Kubernetes namespace name"
}
```

### Step 5: Create `terraform/modules/gke/main.tf`

```hcl
# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "${var.cluster_name}-vpc"
  auto_create_subnetworks = false

  depends_on = [google_project_service.compute]
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.cluster_name}-subnet"
  ip_cidr_range = "10.10.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# GKE Cluster
resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  # Enable Workload Identity for better security
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Enable private cluster for better security (optional)
  # private_cluster_config {
  #   enable_private_nodes    = true
  #   enable_private_endpoint = false
  #   master_ipv4_cidr_block  = "172.16.0.0/28"
  # }

  # Network policy for pod-to-pod communication
  network_policy {
    enabled = true
  }

  # Enable vertical pod autoscaling
  vertical_pod_autoscaling {
    enabled = true
  }

  # Enable horizontal pod autoscaling
  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
    http_load_balancing {
      disabled = false
    }
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  depends_on = [
    google_project_service.container,
    google_project_service.compute,
  ]
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "${google_container_cluster.primary.name}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = var.node_count

  autoscaling {
    min_node_count = 2
    max_node_count = 10
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    preemptible  = var.environment != "prod" # Use preemptible for non-prod
    machine_type = var.machine_type
    disk_size_gb = var.disk_size_gb
    disk_type    = "pd-standard"

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      environment = var.environment
      managed-by  = "terraform"
    }

    # Enable workload identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }
  }
}

# Enable required APIs
resource "google_project_service" "compute" {
  service = "compute.googleapis.com"
}

resource "google_project_service" "container" {
  service = "container.googleapis.com"
}

# Outputs
output "cluster_name" {
  value = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  value = google_container_cluster.primary.endpoint
}

output "cluster_ca_certificate" {
  value = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
}
```

### Step 6: Create `terraform/modules/gke/variables.tf`

```hcl
variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "node_count" {
  type    = number
  default = 3
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "disk_size_gb" {
  type    = number
  default = 50
}

variable "environment" {
  type    = string
  default = "dev"
}
```

---

## Helm Charts Structure

### Step 1: Create Helm Chart Directory Structure

```bash
cd ..
mkdir -p helm/{api-gateway,user-service,budget-service,expense-service,goal-service,notification-service,reporting-service,discovery-server,config-server,mysql,redis}/templates
```

### Step 2: Create Base Chart Template

For each service, you'll create these files. Let's use `api-gateway` as an example:

#### `helm/api-gateway/Chart.yaml`

```yaml
apiVersion: v2
name: api-gateway
description: A Helm chart for API Gateway microservice
type: application
version: 0.1.0
appVersion: "1.0.0"
```

#### `helm/api-gateway/values.yaml` (Best Practices Included)

```yaml
replicaCount: 2

image:
  repository: delose/api-gateway
  pullPolicy: IfNotPresent
  tag: "latest"

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

serviceAccount:
  create: true
  annotations: {}
  name: ""

podAnnotations: {}
podSecurityContext: {}
securityContext: {}

service:
  type: ClusterIP
  port: 8080

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: api.pfms.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-gateway-tls
      hosts:
        - api.pfms.example.com

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

# Liveness and Readiness Probes
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: http
  initialDelaySeconds: 60
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: http
  initialDelaySeconds: 30
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3

# Environment variables
env:
  - name: SPRING_PROFILES_ACTIVE
    value: "kubernetes"
  - name: SPRING_DATASOURCE_URL
    valueFrom:
      secretKeyRef:
        name: mysql-secret
        key: url
  - name: SPRING_DATASOURCE_USERNAME
    valueFrom:
      secretKeyRef:
        name: mysql-secret
        key: username
  - name: SPRING_DATASOURCE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: mysql-secret
        key: password
  - name: EUREKA_CLIENT_SERVICEURL_DEFAULTZONE
    value: "http://discovery-server:8761/eureka"

# ConfigMap for application properties
configMap:
  enabled: true
  data:
    application.yml: |
      server:
        port: 8080
      spring:
        application:
          name: api-gateway

# Node Selector, Tolerations, Affinity (for advanced scheduling)
nodeSelector: {}
tolerations: []
affinity: {}

# Pod Disruption Budget
podDisruptionBudget:
  enabled: true
  minAvailable: 1

# Service Monitor for Prometheus (if using Prometheus Operator)
serviceMonitor:
  enabled: false
  interval: 30s
  scrapeTimeout: 10s
```

#### `helm/api-gateway/templates/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "api-gateway.fullname" . }}
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      {{- include "api-gateway.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "api-gateway.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "api-gateway.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          {{- if .Values.livenessProbe }}
          livenessProbe:
            {{- toYaml .Values.livenessProbe | nindent 12 }}
          {{- end }}
          {{- if .Values.readinessProbe }}
          readinessProbe:
            {{- toYaml .Values.readinessProbe | nindent 12 }}
          {{- end }}
          env:
            {{- toYaml .Values.env | nindent 12 }}
          {{- if .Values.configMap.enabled }}
          volumeMounts:
            - name: config
              mountPath: /app/config
          {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
      {{- if .Values.configMap.enabled }}
      volumes:
        - name: config
          configMap:
            name: {{ include "api-gateway.fullname" . }}-config
      {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

#### `helm/api-gateway/templates/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "api-gateway.fullname" . }}
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "api-gateway.selectorLabels" . | nindent 4 }}
```

#### `helm/api-gateway/templates/hpa.yaml` (Horizontal Pod Autoscaler)

```yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "api-gateway.fullname" . }}
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "api-gateway.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
{{- end }}
```

#### `helm/api-gateway/templates/pdb.yaml` (Pod Disruption Budget)

```yaml
{{- if .Values.podDisruptionBudget.enabled }}
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "api-gateway.fullname" . }}
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
spec:
  {{- if .Values.podDisruptionBudget.minAvailable }}
  minAvailable: {{ .Values.podDisruptionBudget.minAvailable }}
  {{- end }}
  {{- if .Values.podDisruptionBudget.maxUnavailable }}
  maxUnavailable: {{ .Values.podDisruptionBudget.maxUnavailable }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "api-gateway.selectorLabels" . | nindent 6 }}
{{- end }}
```

#### `helm/api-gateway/templates/configmap.yaml`

```yaml
{{- if .Values.configMap.enabled }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "api-gateway.fullname" . }}-config
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
data:
  {{- toYaml .Values.configMap.data | nindent 2 }}
{{- end }}
```

#### `helm/api-gateway/templates/ingress.yaml`

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "api-gateway.fullname" . }}
  labels:
    {{- include "api-gateway.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "api-gateway.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

#### `helm/api-gateway/templates/_helpers.tpl`

```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "api-gateway.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "api-gateway.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "api-gateway.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "api-gateway.labels" -}}
helm.sh/chart: {{ include "api-gateway.chart" . }}
{{ include "api-gateway.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "api-gateway.selectorLabels" -}}
app.kubernetes.io/name: {{ include "api-gateway.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "api-gateway.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "api-gateway.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
```

---

## Kubernetes Best Practices Implementation

### 1. Service Discovery (Eureka in Kubernetes)

In Kubernetes, services are discovered via DNS. Since you're using Eureka, configure services to register with Eureka using Kubernetes service names:

**In your Spring Boot `application-kubernetes.yml`:**

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://discovery-server:8761/eureka
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: false
    hostname: ${HOSTNAME}  # Use pod hostname
```

**Create `helm/discovery-server/values.yaml`:**

```yaml
replicaCount: 1  # Eureka should typically run as a single instance or use Eureka replication

service:
  type: ClusterIP
  port: 8761

# Use StatefulSet for Eureka if you need stable network identity
statefulSet:
  enabled: false
```

### 2. Caching with Redis

#### `helm/redis/values.yaml`

```yaml
architecture: standalone
auth:
  enabled: true
  password: "changeme"  # Use secret in production

master:
  persistence:
    enabled: true
    size: 8Gi
  resources:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

replica:
  replicaCount: 2
  persistence:
    enabled: true
    size: 8Gi

service:
  type: ClusterIP
```

**Add Redis to your Spring Boot services:**

```yaml
spring:
  data:
    redis:
      host: redis-master
      port: 6379
      password: ${REDIS_PASSWORD}
```

### 3. MySQL as StatefulSet (for persistence)

#### `helm/mysql/values.yaml`

```yaml
auth:
  rootPassword: "secret"  # Use secret in production
  database: "pfms"

primary:
  persistence:
    enabled: true
    size: 20Gi
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi

service:
  type: ClusterIP
  port: 3306
```

### 4. Secrets Management

Create secrets for sensitive data:

```yaml
# helm/secrets/templates/mysql-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
stringData:
  url: jdbc:mysql://mysql:3306/pfms
  username: root
  password: secret
```

Or use external secret management (Google Secret Manager):

```yaml
env:
  - name: SPRING_DATASOURCE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: gcp-secret
        key: db-password
```

---

## Deployment Steps

### Step 1: Initialize and Plan Terraform

```bash
cd terraform
terraform init
terraform plan -var="project_id=your-project-id"
```

### Step 2: Create Infrastructure

```bash
terraform apply -var="project_id=your-project-id"
```

### Step 3: Configure kubectl

```bash
gcloud container clusters get-credentials pfms-cluster --region us-central1
kubectl get nodes
```

### Step 4: Install Ingress Controller (NGINX)

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

### Step 5: Install Redis

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis \
  --namespace pfms \
  --set auth.password=your-redis-password
```

### Step 6: Install MySQL

```bash
helm install mysql bitnami/mysql \
  --namespace pfms \
  --set auth.rootPassword=your-db-password \
  --set auth.database=pfms
```

### Step 7: Deploy Applications

```bash
# Deploy in dependency order
helm install discovery-server ./helm/discovery-server -n pfms
helm install config-server ./helm/config-server -n pfms

# Wait for discovery-server to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=discovery-server -n pfms --timeout=300s

# Deploy microservices
helm install api-gateway ./helm/api-gateway -n pfms
helm install user-service ./helm/user-service -n pfms
helm install budget-service ./helm/budget-service -n pfms
# ... etc
```

### Step 8: Verify Deployment

```bash
# Check all pods
kubectl get pods -n pfms

# Check services
kubectl get svc -n pfms

# Check ingress
kubectl get ingress -n pfms

# View logs
kubectl logs -f deployment/api-gateway -n pfms
```

---

## Additional Best Practices

### 1. Network Policies (for pod-to-pod security)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-gateway-netpol
spec:
  podSelector:
    matchLabels:
      app: api-gateway
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: discovery-server
    ports:
    - protocol: TCP
      port: 8761
```

### 2. Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: pfms-quota
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
```

### 3. Monitoring with Prometheus (optional)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

This guide provides a solid foundation. Adapt the values.yaml files for each service based on their specific requirements!

