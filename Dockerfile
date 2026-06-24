FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:dfb1c2241f4965cf6ee7fe5419895aa88c57c4fb2f8f059679e80d94b8ef4d61

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
