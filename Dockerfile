FROM node:lts-alpine
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app
ENV NODE_ENV=production
COPY package*.json yarn.lock ./
# RUN npm install --production=false --silent
RUN yarn install --pure-lockfile --production=false
COPY --chown=node:node . .
EXPOSE 8000
USER node
CMD ["npm", "start"]
