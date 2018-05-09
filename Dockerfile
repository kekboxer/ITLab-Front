FROM node as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist .
RUN npm i -g serve
EXPOSE 8080
CMD [ "serve", "-p", "8080" ]