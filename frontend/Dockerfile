# ambiente de desenvolvimento
FROM node:22-slim as dev

WORKDIR /frontend

COPY package.json ./

RUN npm install 

COPY src/ ./src/ 
COPY public/ ./public/ 
COPY index.html ./ 
COPY vite.config.js postcss.config.js ./

EXPOSE 5173

CMD ["npm" ,"run" ,"dev", "--", "--host", "0.0.0.0"]

# ambiente de produção
FROM node:22-slim as build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine as prod

WORKDIR /frontend

COPY --from=dev /frontend/dist /usr/share/nginx/html 

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
   