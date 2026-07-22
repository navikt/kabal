FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:c41d03dc9d91b5ea7d95602999edecf70bd7f41f5f2f6fd55ea82aa5c4ccb9b6

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend
COPY file-viewer file-viewer

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION=$VERSION

CMD ["--enable-source-maps", "dist/server.js"]
EXPOSE 8080
