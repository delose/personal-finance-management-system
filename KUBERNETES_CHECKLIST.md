# Quick Start Checklist: PFMS Kubernetes Deployment

## Phase 1: Prerequisites ✅
- [ ] Install Terraform: `brew install terraform`
- [ ] Install Helm: `brew install helm`
- [ ] Install gcloud SDK: `brew install google-cloud-sdk`
- [ ] Install kubectl: `brew install kubectl`
- [ ] Login to GCP: `gcloud auth login`
- [ ] Set GCP project: `gcloud config set project YOUR_PROJECT_ID`
- [ ] Enable GKE API: `gcloud services enable container.googleapis.com`

## Phase 2: Terraform Setup 📦
- [ ] Create directory: `mkdir -p terraform/modules/gke`
- [ ] Create `terraform/main.tf` with providers
- [ ] Create `terraform/variables.tf` with your variables
- [ ] Create `terraform/outputs.tf` with cluster info
- [ ] Create `terraform/modules/gke/main.tf` (GKE cluster definition)
- [ ] Create `terraform/modules/gke/variables.tf`
- [ ] Run `terraform init`
- [ ] Run `terraform plan -var="project_id=YOUR_PROJECT_ID"`
- [ ] Run `terraform apply` to create cluster
- [ ] Configure kubectl: `gcloud container clusters get-credentials pfms-cluster --region us-central1`

## Phase 3: Helm Charts Structure 📋

### For EACH service (api-gateway, user-service, budget-service, etc.):
- [ ] Create chart directory: `mkdir -p helm/SERVICE_NAME/templates`
- [ ] Create `Chart.yaml`
- [ ] Create `values.yaml` with:
  - [ ] Resource limits/requests
  - [ ] Liveness/Readiness probes
  - [ ] Environment variables
  - [ ] Service configuration
  - [ ] Ingress configuration (if needed)
  - [ ] HPA configuration
- [ ] Create `templates/deployment.yaml`
- [ ] Create `templates/service.yaml`
- [ ] Create `templates/hpa.yaml`
- [ ] Create `templates/pdb.yaml` (Pod Disruption Budget)
- [ ] Create `templates/configmap.yaml` (if needed)
- [ ] Create `templates/ingress.yaml` (if needed)
- [ ] Create `templates/_helpers.tpl`

## Phase 4: Supporting Services 🔧
- [ ] Install NGINX Ingress: `helm install ingress-nginx ingress-nginx/ingress-nginx`
- [ ] Install Redis: `helm install redis bitnami/redis -n pfms`
- [ ] Install MySQL: `helm install mysql bitnami/mysql -n pfms`
- [ ] Create secrets for database credentials
- [ ] Create secrets for JWT tokens

## Phase 5: Deploy Applications 🚀

### Order matters - deploy in dependency order:
- [ ] 1. `helm install discovery-server ./helm/discovery-server -n pfms`
- [ ] 2. `helm install config-server ./helm/config-server -n pfms`
- [ ] 3. Wait for discovery-server: `kubectl wait --for=condition=ready pod -l app=discovery-server -n pfms`
- [ ] 4. `helm install api-gateway ./helm/api-gateway -n pfms`
- [ ] 5. `helm install user-service ./helm/user-service -n pfms`
- [ ] 6. `helm install budget-service ./helm/budget-service -n pfms`
- [ ] 7. `helm install expense-service ./helm/expense-service -n pfms`
- [ ] 8. `helm install goal-service ./helm/goal-service -n pfms`
- [ ] 9. `helm install notification-service ./helm/notification-service -n pfms`
- [ ] 10. `helm install reporting-service ./helm/reporting-service -n pfms`

## Phase 6: Verification ✅
- [ ] Check all pods: `kubectl get pods -n pfms`
- [ ] Check services: `kubectl get svc -n pfms`
- [ ] Check ingress: `kubectl get ingress -n pfms`
- [ ] Test API Gateway: `curl http://INGRESS_IP/api/v1/budgets/greeting`
- [ ] Check Eureka dashboard (if accessible via port-forward): `kubectl port-forward svc/discovery-server 8761:8761 -n pfms`
- [ ] View logs: `kubectl logs -f deployment/api-gateway -n pfms`

## Phase 7: Best Practices (Optional but Recommended) 🌟
- [ ] Create NetworkPolicies for pod-to-pod communication
- [ ] Set up ResourceQuotas for the namespace
- [ ] Configure PodDisruptionBudgets for high availability
- [ ] Set up Horizontal Pod Autoscaling (HPA)
- [ ] Install Prometheus for monitoring
- [ ] Configure proper logging (e.g., Fluentd/Fluent Bit)
- [ ] Set up CI/CD pipeline for automated deployments

## Common Commands Reference 📚

```bash
# View all resources in namespace
kubectl get all -n pfms

# Describe a pod
kubectl describe pod POD_NAME -n pfms

# Execute command in pod
kubectl exec -it POD_NAME -n pfms -- /bin/bash

# View logs
kubectl logs -f deployment/SERVICE_NAME -n pfms

# Scale deployment
kubectl scale deployment SERVICE_NAME --replicas=3 -n pfms

# Update Helm release
helm upgrade SERVICE_NAME ./helm/SERVICE_NAME -n pfms

# Rollback Helm release
helm rollback SERVICE_NAME REVISION -n pfms

# Delete everything
helm uninstall SERVICE_NAME -n pfms
```

## Troubleshooting Tips 🔍

- **Pods not starting**: Check `kubectl describe pod POD_NAME -n pfms`
- **Service unreachable**: Verify service selector matches pod labels
- **Eureka registration fails**: Check service DNS resolution and network policies
- **Database connection issues**: Verify secrets and service names
- **Ingress not working**: Check ingress controller and ingress resource

