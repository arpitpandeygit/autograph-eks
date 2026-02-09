# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build

RUN apk add --no-cache \
  build-base gcc autoconf automake \
  zlib-dev libpng-dev vips-dev git bash

WORKDIR /opt/

COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm install

WORKDIR /opt/app
COPY . .

# 🔑 IMPORTANT: Build admin + backend
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:22-alpine

RUN apk add --no-cache vips-dev

WORKDIR /opt/

COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./

ENV NODE_ENV=production
ENV PATH=/opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337

CMD ["npm", "run", "start"]

