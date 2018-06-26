FROM node:10

RUN npm i -g npm@6

ADD . /src
WORKDIR /src
RUN npm ci
RUN npm run lint
RUN npm run test
RUN npm prune --production

ENV PORT=3000
EXPOSE 3000

RUN npm link

HEALTHCHECK CMD healthcheck

CMD start