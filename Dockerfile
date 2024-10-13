# develop stage
FROM ghcr.io/micado-eu/quasar:2024 as build-stage
COPY --chown=node:node ./app /code
RUN ls -lat /code

RUN npm install
RUN quasar build

# production stage
FROM alpine
ARG APP_BUILD_DATE
ENV APP_BUILD_DATE=${APP_BUILD_DATE:-0}
LABEL org.label-schema.build-date=$APP_BUILD_DATE 
RUN apk add --no-cache gettext
COPY --from=build-stage /code/dist/spa /var/www/html2
VOLUME /var/www/html2/
COPY busyscript.sh /usr/local/bin/busyscript
RUN chmod +x /usr/local/bin/busyscript
CMD ["busyscript"]
