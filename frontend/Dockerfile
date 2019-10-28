FROM node:10.15

# Expose api port
EXPOSE 80

# Update apt caches
RUN apt update

# Install nginx
RUN apt-get install -y --no-install-recommends nginx

# Install Angular cli
RUN npm install -g @angular/cli@8.0.2

# Frontend config
RUN rm /etc/nginx/sites-enabled/default
COPY ./config/frontend.conf /etc/nginx/sites-enabled/frontend

WORKDIR /frontend

# Serve with nginx in the foreground
CMD nginx -g 'daemon off;'
