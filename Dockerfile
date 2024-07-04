FROM node:12-slim@sha256:c28ca4124ac84ff1e72ee68abfe70aa4cc86f499c1ef20408dc2d35af1058ac1
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
