# Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:1.29-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY certs/privkey.pem /etc/ssl/certs/privkey.pem

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
