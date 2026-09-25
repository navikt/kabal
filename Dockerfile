FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim@sha256:375cd0b3cf78050ac7a1e89f1b0be4d30ff1b3d170557268c6fd5d3685db9e6e

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
