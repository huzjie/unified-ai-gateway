# 常用命令

.PHONY: install dev dev-web build test lint typecheck format docker-up docker-down clean

install:
	pnpm install

dev:
	npm run dev

dev-web:
	npm run dev:web

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

format:
	pnpm format

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

clean:
	rm -rf node_modules */node_modules */dist */coverage
