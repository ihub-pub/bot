FROM node:22-slim@sha256:87111792bf0472e68b13ac3b5436116a2dd699f0d178c0eac38d9f60cf30bc3c
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
