FROM node:22-slim@sha256:426d99333b9d35f568cc604b604ea484aef7d12b21e78a36c4bfbdf5cfa4afe2
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
