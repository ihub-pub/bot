FROM node:22-slim@sha256:14e3e539464a5a77bb5fd8f613cbd54d1842a900e7f4ce06f47e42f6a89a83e4
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
