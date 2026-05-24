FROM hugomods/hugo:latest AS builder
ARG BASE_URL=https://blog.iankulin.com
WORKDIR /src
COPY . .
RUN hugo --minify --baseURL "${BASE_URL}"

FROM nginx:alpine
COPY --from=builder /src/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
