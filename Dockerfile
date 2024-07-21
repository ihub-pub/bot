FROM node:22-slim@sha256:70666190c55408e0ea297dc9d4be5d89729d888f4bb720d4b77433c117509cc4
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
