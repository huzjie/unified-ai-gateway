#!/bin/sh
# 容器启动入口：等待 DB 就绪、执行迁移、启动服务
set -e

echo "[entrypoint] waiting for database..."
# 等待数据库目录可写
if [ -n "$UAG_DATABASE_PATH" ]; then
  db_dir=$(dirname "$UAG_DATABASE_PATH")
  mkdir -p "$db_dir"
fi

echo "[entrypoint] starting gateway..."
exec "$@"
