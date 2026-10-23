FROM node:22-alpine

WORKDIR /app

# Allow the Tibia 7.4 world map loader more V8 heap; Render free memory is still limited.
ENV NODE_OPTIONS="--max-old-space-size=384"

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]
