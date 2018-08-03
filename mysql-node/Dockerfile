###############################################################################
# Step 1 : Builder image
#
FROM node:9-alpine AS builder

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr && cp -a /tmp/node_modules /usr

# add project files
WORKDIR /usr
ADD . /usr

EXPOSE 3000

CMD ["nodemon", "-L", "server.js"]