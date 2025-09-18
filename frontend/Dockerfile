FROM node:20 AS build

WORKDIR /app

COPY package.json tsconfig.json vite.config.ts tsconfig.node.json ./
COPY tailwind.config.js postcss.config.js ./
RUN npm install

COPY src ./src
COPY index.html ./

RUN npm run build

# Production image
FROM nginx:1.25
COPY --from=build /app/dist /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

