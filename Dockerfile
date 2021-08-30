FROM node:16
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 8080:8080