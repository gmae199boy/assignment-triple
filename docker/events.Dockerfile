FROM node:16.13.0

WORKDIR /server
COPY package.json /server

RUN npm install
RUN npm install -g pm2
COPY . /server
RUN npm run build

ENV DB_ADDRESS=mysql://1:1@db:3306/triple
ENV SERVER_PORT=8080
ENV SERVER_ADDRESS=0.0.0.0

EXPOSE 8080

CMD ["pm2-runtime", "start", "dist/src/server.js"]
# CMD ["npm", "start"]