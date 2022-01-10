FROM node:16-alpine

WORKDIR '/app'

COPY package.json .
RUN apk add --no-cache python3 gcc g++ make && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3

COPY . .

CMD ["npm", "run", "start"]
