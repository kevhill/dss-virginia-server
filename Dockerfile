# Taken from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# some npm modules need to be installed globally
RUN npm install -g supervisor

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]