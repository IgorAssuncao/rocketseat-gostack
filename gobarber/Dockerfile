FROM node:10-slim

WORKDIR /usr/app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]