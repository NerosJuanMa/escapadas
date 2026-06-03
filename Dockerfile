FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx gulp

EXPOSE 3000

CMD ["node", "dist/backend/server.js"]