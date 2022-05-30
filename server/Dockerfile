FROM node:12

WORKDIR /application
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY server.ts ./
COPY config ./config

RUN npm install

EXPOSE 18200

RUN ls

CMD ["npm", "run", "dev"]