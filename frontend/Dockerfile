FROM node:22-slim AS build-stage
# Update the npm bundled with the base image (vulnerable dependencies)
RUN npm install -g npm@11.21.1 && npm cache clean --force
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]
