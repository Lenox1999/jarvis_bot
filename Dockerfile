FROM node:14

COPY package.json ./

COPY package-lock.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD ["node", "dist/app.js"]
USER node