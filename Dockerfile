FROM node:22
LABEL maintainer="contactus@sravz.com"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

ENV NODE_OPTIONS=--max_old_space_size=8192
# RUN mkdir -p /home/node/ && chown -R node:node /home/node/
# WORKDIR /home/node
# # Create app directory
# WORKDIR /home/node/
# RUN mkdir /home/node/.npm-global
# ENV PATH=/home/node/.npm-global/bin:$PATH
# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# COPY . .
# RUN chown -R node:node /home/node/*
RUN npm install -g @angular/cli
# RUN npm i -g gzipper

# USER node
# RUN npm install --also=dev
# RUN rm -f .npmrc || true

EXPOSE 4200
#CMD ["ng","serve","--host", "0.0.0.0", "--disable-host-check"]
# docker compose runs ng serve as an entry point command
ENTRYPOINT []