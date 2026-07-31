#!/bin/sh
# 容器健康检查：curl /healthz
set -e

if command -v wget >/dev/null 2>&1; then
  wget -q -O /dev/null http://127.0.0.1:8787/healthz
else
  node -e "fetch('http://127.0.0.1:8787/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
fi
