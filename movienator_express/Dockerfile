FROM node:latest

# Create app directory
WORKDIR /usr/src/app

RUN yarn global add nodemon

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#No idea why, but the only way I could get some of these
#packages to work was to manually stall them globally in the Container

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
EXPOSE 9229

CMD [ "npm", "run", "dev" ]