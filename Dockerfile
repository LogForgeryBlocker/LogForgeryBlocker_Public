FROM node:16.13.0 as build-deps
WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY ./.env ./

RUN yarn install

COPY . .

RUN npm run build

FROM node:16.13.0

COPY --from=build-deps /app/node_modules ./node_modules
COPY --from=build-deps /app/package.json /app/yarn.lock ./
COPY --from=build-deps /app/dist ./dist
COPY --from=build-deps /app/prisma ./prisma
COPY --from=build-deps /app/.env ./

EXPOSE 3000
CMD [ "npm", "run", "start:migrate" ]
