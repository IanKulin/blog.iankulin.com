FROM hugomods/hugo:latest AS hugo-builder
ARG BASE_URL=https://blog.iankulin.com
WORKDIR /src
COPY . .
RUN hugo --minify --baseURL "${BASE_URL}"

FROM node:alpine AS pagefind-builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY --from=hugo-builder /src/public ./public
RUN npx pagefind --site public --root-selector "main.layout__main"

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=pagefind-builder /src/public /usr/share/nginx/html
EXPOSE 80
