FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update -y \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npm ci

COPY . ./

RUN npm run db:generate

EXPOSE 8010

CMD ["npm", "run", "start:prod"]