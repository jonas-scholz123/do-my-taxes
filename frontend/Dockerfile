# pull base image
FROM node:latest

# set working directory
WORKDIR /app

# install app dependencies

COPY package.json ./

RUN npm install --force

# add app
COPY . .

#start app

CMD ["npm", "start"]