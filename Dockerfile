FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY server.js .

ENV PORT=64464
ENV HOSTNAME="0.0.0.0"

EXPOSE 64464

CMD ["node", "server.js"]
