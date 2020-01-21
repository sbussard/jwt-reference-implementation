FROM node:13.6
RUN apt update && apt install yarn -y
WORKDIR /api
COPY package.json .
COPY yarn.lock .
RUN yarn install

CMD ["npx", "nodemon"]