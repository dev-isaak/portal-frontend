FROM node:18-alpine3.17

# RUN mkdir /app

# Installing libvips-dev for sharp Compatibility
# RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

WORKDIR /app
COPY package.json .
COPY package-lock.json .

# RUN npm cache clean --force

# RUN npm install -g npm@10.2.5
RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]