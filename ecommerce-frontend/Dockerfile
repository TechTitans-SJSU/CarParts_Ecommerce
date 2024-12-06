# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Create a .env file with build-time arguments
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_CLIENT_ID

# Create .env file with build arguments
RUN echo "REACT_APP_KEYCLOAK_URL=${REACT_APP_KEYCLOAK_URL}" > .env && \
    echo "REACT_APP_KEYCLOAK_REALM=${REACT_APP_KEYCLOAK_REALM}" >> .env && \
    echo "REACT_APP_KEYCLOAK_CLIENT_ID=${REACT_APP_KEYCLOAK_CLIENT_ID}" >> .env

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
