FROM node:20-alpine

WORKDIR /app

# Install build tools for native dependencies (such as bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
