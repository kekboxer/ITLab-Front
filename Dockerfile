FROM node as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/server.js/ ./server.js
RUN npm install express connect-history-api-fallback
EXPOSE 8080
CMD [ "node", "server.js" ]