FROM node:16-alpine

WORKDIR /var/www/app

COPY ./packages/backend/package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./packages/backend ./

RUN yarn build

CMD ["yarn", "prod"]
