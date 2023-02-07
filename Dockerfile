FROM node:16
WORKDIR /app
COPY package.json /app/package.json
RUN yarn install
COPY img /app/img
COPY scss /app/scss
COPY ts /app/ts
COPY index.html /app/index.html
COPY tsconfig.json /app/tsconfig.json
COPY vite.config.js /app/vite.config.js
EXPOSE 6173
CMD [ "yarn", "dev", "--", "--host" ]