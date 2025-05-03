# First Stage: Angular build
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build -- --configuration production

# Second Stage: Nginx as server
FROM nginx:alpine
COPY --from=build /app/dist/open-earth-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
