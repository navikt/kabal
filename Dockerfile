FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim@sha256:90555d6d052cdc3ba6d80514fa36ed30cd76a528e02c2d3b10d6ce1560b236aa

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app

COPY server/dist server/dist
COPY server/src/templates server/src/templates
COPY server/node_modules server/node_modules
COPY frontend/dist/index.html frontend/dist/index.html
COPY file-viewer/dist/index.html file-viewer/dist/index.html

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION=$VERSION

CMD ["--enable-source-maps", "--trace-warnings", "dist/server.js"]
EXPOSE 8080
