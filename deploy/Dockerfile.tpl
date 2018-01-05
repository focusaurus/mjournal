#https://hub.docker.com/r/mhart/alpine-node/
FROM mhart/alpine-node:9.3.0
# get the slow/big stuff done early so the cache is rarely invalidated

# git is a bower dependency
# bash is used for some scripts in ./bin which also run in the container build
RUN apk add git bash --update-cache
ENV BASE "/opt/{{MJ_APP_NAME}}"
WORKDIR "${BASE}"
ADD bin "${BASE}/bin"
ADD browser "${BASE}/browser"
ADD wwwroot "${BASE}/wwwroot"
RUN chmod +x ./bin/*.*
ADD package*.json "${BASE}/"
RUN npm install

# OK, all the slow stuff has been run and hopefully cached
ADD app "${BASE}/app"
ADD migrations "${BASE}/migrations"
ADD config.default.js "${BASE}"
ADD knexfile.js "${BASE}"
RUN npm prune --production

ENV NODE_ENV production
EXPOSE {{MJ_PORT}}
USER nobody
CMD ["node", "."]
