# ===== Unified AI Gateway 多阶段构建 =====

# ---- Stage 1: base ----
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4
WORKDIR /app

# ---- Stage 2: deps ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile=false --ignore-scripts=false

# ---- Stage 3: build ----
FROM deps AS build
COPY . .
RUN pnpm build

# ---- Stage 4: gateway runtime ----
FROM node:20-alpine AS gateway
RUN npm install -g pnpm@9.15.4
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/gateway/package.json ./apps/gateway/package.json
COPY --from=build /app/apps/gateway/dist ./apps/gateway/dist
COPY --from=build /app/packages ./packages
RUN mkdir -p /app/data
COPY .docker/healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/healthcheck.sh
EXPOSE 8787
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD healthcheck.sh
CMD ["node", "apps/gateway/dist/index.js"]

# ---- Stage 5: web runtime ----
FROM nginx:1.27-alpine AS web
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
