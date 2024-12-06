# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Use 'serve' to run the app
# CMD ["serve", "-s", "build"]
CMD ["serve", "-s", "build", "-l", "3004"]

# Expose the port
EXPOSE 3004
