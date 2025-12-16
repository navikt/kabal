FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:4ce1f1d65d99c35f6d5acc2da5a462311ea0f80252969ee971b503f746b57f62

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION=$VERSION

CMD ["--enable-source-maps", "dist/server.js"]
EXPOSE 8080
