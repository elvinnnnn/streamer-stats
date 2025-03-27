FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -g @angular/cli && npm install
COPY . .
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
