FROM node:18-alpine as nodework 
WORKDIR /myapp
COPY package*.json ./

RUN npm install

COPY . .

# Build the application
ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}

ARG REACT_APP_CSV_URL
ENV REACT_APP_CSV_URL=${REACT_APP_CSV_URL}

ARG REACT_APP_BASE_URL_MAIN
ENV REACT_APP_BASE_URL_MAIN=${REACT_APP_BASE_URL_MAIN}

RUN npm run build

#nginx block
FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html 

# COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ./*
# COPY --from=nodework /myapp/build .
COPY  --from=nodework /myapp/build /usr/share/nginx/html
COPY --from=nodework /myapp/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ "nginx","-g","daemon off;"]
