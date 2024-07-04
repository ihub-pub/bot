FROM node:22-slim@sha256:ee76feb064dbe3579085bc2517cb54ecf64b083db8f6f80341cfe4a4770d1415
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
