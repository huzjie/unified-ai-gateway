# Kubernetes 部署

```yaml
# deployment.yaml（示例）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uag-gateway
spec:
  replicas: 2
  selector:
    matchLabels: { app: uag-gateway }
  template:
    metadata:
      labels: { app: uag-gateway }
    spec:
      containers:
        - name: gateway
          image: ghcr.io/unified-ai-gateway/unified-ai-gateway:latest-gateway
          ports: [{ containerPort: 8787 }]
          envFrom:
            - secretRef: { name: uag-env }
          volumeMounts:
            - { name: data, mountPath: /app/data }
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: uag-data
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: uag-gateway
spec:
  selector: { app: uag-gateway }
  ports:
    - { port: 8787, targetPort: 8787 }
```

水平扩展要点：M1 使用 SQLite 单实例；P2 启用 Redis 共享限流/熔断状态后即可多副本。
