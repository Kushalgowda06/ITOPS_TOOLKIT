# Step 1: Build React app
# Pin to Node 18 because Create React App fails to build reliably with Node 20+ (OpenSSL breaking change)
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with NGINX
# 1.29-alpine is not published; stick to the latest stable 1.27 series for compatibility
FROM nginx:1.27-alpine

# Copy React build to NGINX html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates
COPY certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY certs/privkey.pem /etc/ssl/certs/privkey.pem

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
