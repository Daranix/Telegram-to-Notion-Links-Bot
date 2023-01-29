FROM node:lts-hydrogen
WORKDIR /app
COPY package*.json ./
COPY dist/* ./
RUN npm install
CMD [ "npm", "start" ]