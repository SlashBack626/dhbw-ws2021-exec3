FROM node:alpine

COPY ./package.json .

RUN npm i

COPY . .

RUN npm run build

CMD [ "npx", "serve", "-s" ,"build", "-l", "5000" ]