# base image
#FROM 618187721717.dkr.ecr.us-east-1.amazonaws.com/baseline-repository:node-14.17.0 AS compile-image

FROM node:14.21.3 AS compile-image
# Identify the maintainer of an image:
LABEL maintainer="support@inadev.com"

# install angular version 8.3.25
RUN npm install -g @angular/cli@latest

# set working directory
WORKDIR /opt/soucs-admin

# Copy Code Base From Local
COPY . /opt/soucs-admin

# Install dependencies
RUN npm install

# add ./node_modules/.bin to $PATH
ENV PATH="./node_modules/.bin:$PATH"

EXPOSE 80

# build the library and the project in prod mode
RUN npm run build

# Set up nginx
FROM nginx:1.15-alpine
RUN rm -rf /usr/share/nginx/html && \
    rm -rf /etc/nginx/conf.d/default.conf

# Copy config and run project
COPY buildconfig/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compile-image /opt/soucs-admin/dist/soucs /usr/share/nginx/html

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/js/env.template.js > /usr/share/nginx/html/assets/js/env.js && exec nginx -g 'daemon off;'"]

