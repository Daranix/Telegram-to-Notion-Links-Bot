FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
COPY dist/ ./
RUN npm install
CMD [ "npm", "start" ]