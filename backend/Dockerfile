FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

EXPOSE 8010

CMD ["npx", "tsx", "./src/server.ts"]