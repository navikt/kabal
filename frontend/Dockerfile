FROM node:16-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]
EXPOSE 8060
