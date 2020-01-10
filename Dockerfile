# develop stage
FROM micadoproject/quasar:1.0.3 as build-stage
COPY --chown=node:node ./app /code
RUN ls -lat /code

RUN npm install
RUN quasar build

# production stage
FROM nginx:1.17.5-alpine as production-stage
COPY --from=build-stage /code/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
