FROM node:18.16.0-alpine

ENV NODE_ENV=development

ARG TZ='America/Sao_Paulo'

ENV TZ ${TZ}

RUN apk upgrade --update \
    && apk add --no-cache bash \
    && apk add -U tzdata \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && apk add chromium

RUN npm install -g npm
RUN npm i -g @angular/cli@16.0.0

USER node

WORKDIR /home/node/app

COPY . .
