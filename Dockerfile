FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:d643f8878f9f9e6eed5448009d49e745e32701c9f3bd5a5fcd3cb89dd7b8be8e

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
