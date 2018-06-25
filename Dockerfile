FROM node:10-alpine as build

# install gyp tools
RUN apk add --update --no-cache \
        python \
        make \
        g++

RUN npm i -g npm@6

ADD . /src
WORKDIR /src
RUN npm install
RUN npm run lint
RUN npm run test
RUN npm prune --production

# Install cURL for healthcheck
FROM node:10-alpine

ENV PORT=3000
EXPOSE $PORT

ENV DIR=/usr/src/service
WORKDIR $DIR

COPY --from=build /src/package.json package.json
COPY --from=build /src/package-lock.json package-lock.json
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/handlers handlers
COPY --from=build /src/bin bin
COPY --from=build /src/config.mjs config.mjs
RUN npm link

HEALTHCHECK CMD healthcheck

CMD node --experimental-modules ./bin/start.mjs
