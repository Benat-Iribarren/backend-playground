FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++ \
    git \
    && apk upgrade --no-cache

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/auth/infrastructure/server/index.js"]
