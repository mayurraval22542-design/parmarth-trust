# Use lightweight Nginx Alpine image
FROM nginx:alpine

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration for clean routing & performance
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website assets to Nginx web root
COPY . /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
