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

# Copy simple nginx.conf
COPY nginx-simple.conf /etc/nginx/nginx.conf

# Expose HTTP port only
EXPOSE 80

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
