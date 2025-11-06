# Step 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:1.25-alpine

# Copy React build to NGINX html folder
COPY --from=build /app/build /usr/share/nginx/html

# Remove all default nginx configs
RUN rm -rf /etc/nginx/conf.d/* && \
    rm -f /etc/nginx/nginx.conf

# Create nginx config inline
RUN echo 'worker_processes auto; \
error_log /var/log/nginx/error.log warn; \
pid /var/run/nginx.pid; \
events { worker_connections 1024; } \
http { \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    sendfile on; \
    keepalive_timeout 65; \
    server { \
        listen 80 default_server; \
        server_name _; \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        location / { try_files $uri $uri/ /index.html; } \
        location ~ ^/(llm|itsm|rosters|database|train_assist|vector_database|remote_file_management|kb_management|change_management|resolution_management|health|documentation)/ { \
            proxy_pass http://backend:8000; \
            proxy_set_header Host $host; \
            proxy_set_header X-Real-IP $remote_addr; \
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
            proxy_set_header X-Forwarded-Proto $scheme; \
            proxy_set_header Authorization $http_authorization; \
        } \
        location /health { \
            proxy_pass http://backend:8000/health; \
            proxy_set_header Host $host; \
        } \
    } \
}' > /etc/nginx/nginx.conf

# Expose HTTP port only
EXPOSE 80

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
