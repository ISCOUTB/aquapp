FROM node:10.15

# Install nginx
RUN apt update; apt-get install -y --no-install-recommends nginx; apt clean

# Install Angular cli
RUN npm install -g @angular/cli@8.0.2

# Frontend config
RUN rm /etc/nginx/sites-enabled/default
COPY ./config/frontend.conf /etc/nginx/sites-enabled/frontend

WORKDIR /build

COPY . .

RUN npm install && \
    ng build --prod --aot --build-optimizer

# Expose api port
EXPOSE 80
# Serve with nginx in the foreground
CMD nginx -g 'daemon off;'
