# STAGE 1: BUILD
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# STAGE 2: PRODUCTION
FROM node:20-alpine 

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY package.json ./

EXPOSE 8000

CMD ["node", "dist/src/app.js"]