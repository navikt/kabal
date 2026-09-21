FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim@sha256:1f2360dca173912327817bc7834ea6f9bcbd877d1eade11d7f51ef29afc96564

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
