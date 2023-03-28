FROM node:18-alpine
ENV NODE_ENV production
ENV NPM_CONFIG_CACHE=/tmp
ARG VERSION
ENV VERSION $VERSION

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend

WORKDIR /usr/src/app/server

CMD ["npm", "start"]
EXPOSE 8080
