FROM oven/bun:alpine

ENV NODE_ENV production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION $VERSION

CMD ["bun", "run", "start"]
EXPOSE 8080
