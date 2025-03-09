
FROM node:20.18 AS base

FROM base AS deps

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY ./package.json ./
RUN npm install -g npm@10.8.2
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install

FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run generate

EXPOSE 3002
CMD ["npm", "start"]

