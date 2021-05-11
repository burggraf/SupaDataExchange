# FROM node:14
# FROM node:current-buster
FROM alpine
# FROM node
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json*", "./"]

RUN apk add --update npm
RUN apk add sqlite-dev
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./server .
COPY ./www .
COPY ./pgloader .

EXPOSE 8080
CMD [ "node", "server.js" ]

