# Express Backend for Recipes App

Welcome to the Recipes Backend, a robust and feature-rich backend service designed to manage and serve delicious recipes to users. This application is built on the OpenAPI 3.1 specification, ensuring a well-structured and standardized API design.

## Overview

The Recipes Backend is designed to handle a wide range of operations related to recipes. It can manage recipe data, including ingredients, preparation steps, and images. It also supports user management, allowing users to create accounts, save their favorite recipes, and share their own recipes.

The application is built with a focus on performance, scalability, and security. It uses modern technologies and follows best practices to ensure it can handle high loads, scale as needed, and protect user data.

## Features

- **Recipe Management**: Create, update, delete, and retrieve recipes. Each recipe includes ingredients, preparation steps, images, and more.
- **User Management**: Handle user registration, authentication, and profile management. Users can save their favorite recipes and share their own.
- **Search and Filter**: Users can search for recipes based on various criteria, such as ingredients, cooking time, and difficulty level.
- **Image Handling**: Support for uploading and serving images. Each recipe can include multiple images.
- **API Documentation**: Comprehensive API documentation based on the OpenAPI 3.0 specification.

## Technology Stack

The Recipes Backend is built with a modern technology stack:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A fast, unopinionated, and minimalist web framework for Node.js.
- **MongoDB**: A source-available cross-platform document-oriented database program.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Swagger**: An Interface Description Language for describing RESTful APIs expressed using JSON.

# Installation

## Using Docker recommended

To run the application using Docker, you need to have Docker installed on your machine. If you don't have Docker installed, you can download and install it from the official website: [Docker](https://www.docker.com/).

1. Install [Docker](https://www.docker.com/) on your machine.
2. Clone the project **repository**.
3. Navigate to the project directory.
4. Create a `.env` file in the root directory and copy paste the content of `.env.sample` and add necessary credentials.
5. Run the following command to build the Docker image:

```bash
docker compose up --build --attach expressbackend

# --build: Rebuild the image and run the containers
# --attach: only show logs of Node app container and not mongodb
```

6. Access the project APIs at the specified endpoints.

## Running Locally

To run the project locally, follow the steps below:

1. Install [yarn](https://yarnpkg.com/getting-started/install), [Nodejs](https://nodejs.org/en), [MongoDB](https://www.mongodb.com/try/download/community) and [MongoDB Compass(optional)](https://www.mongodb.com/try/download/compass) on your machine.
2. Clone the project **repository**.
3. Navigate to the project directory.
4. Create a `.env` file in the root directory and copy paste the content of `.env.sample` and add necessary credentials.
5. Install the packages.

```bash
yarn install
```

6. Run the project.

```bash
yarn start
```

7. Access the project APIs at the specified endpoints.

## LICENSE

[MIT License](LICENSE)
