# First Stage: Angular build
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build -- --configuration production

# Second Stage: Nginx as server
FROM nginx:alpine
COPY --from=build /app/dist/open-earth-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Crear un archivo default.conf vacío para evitar problemas de configuración
RUN touch /etc/nginx/conf.d/default.conf

# Garantizar que la configuración sea legible por nginx
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
