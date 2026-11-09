# web-svc: Next.js standalone 이미지 (Oracle A1 = arm64, 로컬은 그 기계 아키텍처로 빌드된다)
#
#   docker build -t factos-web .
#
# NEXT_PUBLIC_* 값은 빌드 때 자바스크립트에 박힌다 — 실행 때 바꿀 수 없다.
# 운영은 API를 같은 출처(nginx의 /api)로 부르므로 NEXT_PUBLIC_API_URL을 빈 값으로 둔다.
# 서버 렌더링이 부르는 내부 주소(INTERNAL_API_URL)는 실행 때 compose가 넣는다.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_SITE_URL="https://fipa-news.kr"
# travel-svc도 같은 출처(/api/travel, nginx가 넘긴다)
ARG NEXT_PUBLIC_TRAVEL_API_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_TRAVEL_API_URL=$NEXT_PUBLIC_TRAVEL_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# root로 돌리지 않는다.
# 실행에는 node만 있으면 된다 — 베이스 이미지에 딸린 npm·corepack(과 그 안에 묶인 라이브러리)을 지우고,
# OS 보안 패치를 받는다 (CI Trivy 게이트가 고칠 수 있는 취약점을 막는다)
RUN apk upgrade --no-cache \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
 && addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
