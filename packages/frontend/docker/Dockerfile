# Reference: https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

# build stage
FROM node:16-alpine as build-stage

WORKDIR /var/www/app

COPY ./packages/frontend/package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./packages/frontend ./

ARG BACKEND_URL=$BACKEND_URL

RUN VITE_APP_API_URL=$BACKEND_URL yarn build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /var/www/app/dist /var/www/app
COPY ./packages/frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]