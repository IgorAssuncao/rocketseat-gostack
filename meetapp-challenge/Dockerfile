FROM node:12.9.0-buster-slim

WORKDIR /usr/app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]
