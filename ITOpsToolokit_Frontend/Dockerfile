FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ssl/privkey.pem /etc/ssl/private/privkey.pem
RUN chmod 644 /etc/ssl/certs/fullchain.pem && chmod 600 /etc/ssl/private/privkey.pem
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]