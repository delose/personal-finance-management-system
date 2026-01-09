
#### Prerequisites 
Install Kubernetes CLI - `kubectl`
```bash
brew install kubectl
```

#### Check the cluster status
```bash
kubectl cluster-info
```

#### Verify the node is ready
```bash
kubectl get nodes
```

#### Docker Desktop > Kubernetes stuck at loading [fix]
1. Stop/kill Docker Desktop
2. Open ~/Library/"Group Containers"/group.com.docker/settings-store.json
3. Change these from true to false
```shell
"KubernetesEnabled": false,
"KubernetesInitialInstallPerformed": false,
```
4. Start Docker Desktop
5. Run `docker system prune -a` to delete stopped containers which includes those needed for kubernetes
6. Re-enable kubernetes in the settings which will re-downloaded containers for kubernetes
7. Do not use `Kubeadm`

### Enabling Kubernetes in Docker Desktop
#### Use `kind` instead with the correct kubectl version (see below) in the Docker Desktop dropdown

#### kubectl version
```shell
kubectl version
```
