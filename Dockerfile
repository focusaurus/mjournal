FROM nodesource/node
ENV NODE_ENV production
ENV NODE_PATH /opt/mjournal
EXPOSE 9090
WORKDIR /opt/mjournal
#USER mjournal

RUN apt-get update -y
RUN apt-get install -y git-core
ADD bower.json /opt/mjournal/bower.json
ADD package.json /opt/mjournal/package.json
RUN npm install --production

ADD . /opt/mjournal
CMD ["./app/server.js"]
