FROM node:alpine

RUN mkdir -p home/app

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "preview", "--", "--host=0.0.0.0", "--port=8000"]