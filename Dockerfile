FROM node

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npx", "cross-env",  "node", "./server.js" ]
