#https://hub.docker.com/r/mhart/alpine-node/
FROM mhart/alpine-node:6.2.1
# get the slow/big stuff done early so the cache is rarely invalidated

# git is a bower dependency
# bash is used for some scripts in ./bin which also run in the container build
RUN apk add git bash --update-cache
WORKDIR /opt
ADD ./package.json  /opt/package.json
RUN npm install
ADD ./bower.json  /opt/bower.json
RUN ./node_modules/.bin/bower --allow-root --config.analytics=false install

# OK, all the slow stuff has been run and hopefully cached
ADD app /opt/app
ADD wwwroot /opt/wwwroot
ADD migrations /opt/migrations
ADD knexfile.js config.default.js /opt/
ADD bin/build-browserify.sh /opt/bin/build-browserify.sh
RUN bash ./bin/build-browserify.sh \
  && npm prune --production

ENV NODE_ENV production
EXPOSE {{MJ_PORT}}
USER nobody
CMD ["/opt/app/server.js"]