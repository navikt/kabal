FROM node:16-alpine
ENV NODE_ENV development

WORKDIR /usr/src/app

COPY . .
COPY .env.development .env
RUN npm install

CMD ["npm", "run", "docker"]
EXPOSE 8090
