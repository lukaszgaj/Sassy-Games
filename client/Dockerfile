FROM node:12

WORKDIR /application
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY config ./config
COPY public ./public
COPY scripts ./scripts

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]