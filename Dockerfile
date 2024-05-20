FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production=false --silent
RUN yarn install --pure-lockfile --production=false
COPY . .
EXPOSE 8000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
