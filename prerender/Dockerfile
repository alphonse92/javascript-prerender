FROM gcr.io/google_appengine/nodejs

RUN /usr/local/bin/install_node 8.15.0

WORKDIR /usr/src/app

#disable chromium installation
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package.json ./

RUN npm install nodemon -g

RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
  cat npm-debug.log; \
  fi) && false)

COPY ./ ./

RUN mkdir -p ./tmp/prerender/

EXPOSE 3000

CMD ["npm", "start"]
