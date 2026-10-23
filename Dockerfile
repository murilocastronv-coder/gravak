FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm run db:push && npm run start"]
