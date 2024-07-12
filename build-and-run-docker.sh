#!/bin/sh

# Navigate to the Docker directory
cd Docker

# Build the Docker image
docker build -t my-supermarket-db .

# Stop and remove the existing container if it exists
if [ "$(docker ps -aq -f name=my-supermarket-db)" ]; then
    docker stop my-supermarket-db
    docker rm my-supermarket-db
fi

# Run the Docker container
docker run -d -p 1433:1433 --name my-supermarket-db my-supermarket-db

# Confirm the container is running
docker ps | grep my-supermarket-db

echo "SQL Server is running on localhost:1433. You can connect using SQL Server Authentication with username 'SA' and password 'Aa123456'."
