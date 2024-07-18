FROM node:22-slim@sha256:3e4b1fdda6c3c8bde15e4f626e9c51971165218fb0befe105594070feefc8330
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
