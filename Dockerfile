FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install project dependencies
RUN npm install


# Copy the rest of the application code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
