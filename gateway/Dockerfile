FROM gcr.io/google_appengine/nodejs

RUN /usr/local/bin/install_node 8.15.0

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install nodemon -g

RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
  cat npm-debug.log; \
  fi) && false)

COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]
