# ================================
# 1. Build Stage
# ================================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# ================================
# 2. Production Stage
# ================================
FROM nginx:alpine

# Copy the React build output to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Remove default nginx config and add a new one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
