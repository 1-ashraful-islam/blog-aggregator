# Blog Aggregator in Go

[![GoSec Security Scanner](https://github.com/1-ashraful-islam/blog-aggregator/actions/workflows/gosec.yml/badge.svg)](https://github.com/1-ashraful-islam/blog-aggregator/actions/workflows/gosec.yml)

> :loudspeaker: **Announcement**:This project got too big and more complex than I anticipated. I moved this project from the subfolder of [boot.dev-projects](https://github.com/1-ashraful-islam/boot.dev-projects) repository.

This project is a blog aggregator service in Go. It utilizes RESTful API that fetches data from remote locations and stores them in a production-ready database tools like PostgreSQL, SQLc, Goose, and pgAdmin.

It also utilizes a long-running service worker that reaches out over the internet to fetch data from remote locations.

## Getting Started

### Setting up - backend

Setting up involves creating a `.env` file, starting the PostgreSQL server, applying the database migrations, and running the backend server.

1. Rename the `.env.example` file to `.env`, and fill in the required environment variables. Make sure to have proper `DATABASE_NAME` in the `.env` file.

    ```bash
    cp .env.example .env
    ```

2. Run the following command to start postgresql server using docker-compose. This will also create the database required for the project.

    ```bash
    docker-compose up -d
    ```
  
3. Run the following command to use `goose` to apply migrations

    ```bash
    docker-compose run --rm go-tools goose up
    ```

4. Build the backend Go project and run the backend server

    ```bash
    go build -o blog-aggregator
    ./blog-aggregator
    ```

5. When done, run the following command to stop `postgresql` and `pgadmin` server using docker-compose

    ```bash
    docker-compose down
    ```

### Setting up - frontend

Setting up the frontend involves installing the npm packages and starting the frontend server.

1. In another terminal window, go to the webui directory to install the npm packages

   ```bash
    cd webui
    npm install
    ```

2. Run the following command to start the frontend server

    ```bash
    npm start
    ```

## Additional tools and commands

Docker compose file also installs Go tools (`sqlc` and `goose`) inside a docker container. This setup encapsulates your development environment within Docker, keeping your host machine clean and ensuring consistency across different development setups.

To use `sqlc` and `goose`, you would run commands inside the `go-tools` container. For example, to generate SQLC code, you might use:

```bash
docker-compose run --rm go-tools sqlc generate
```

Or to apply migrations with `goose`, you might use:

```bash
docker-compose run --rm go-tools goose up
```

Remember to rebuild your Docker Compose services if you make changes to the Dockerfile or need to update the tools:

```bash
docker-compose build go-tools
```

## Manage database with pgAdmin

1. Go to pgAdmin console window in your browser using the `http://localhost:{PGADMIN_PORT}`. Lookup the port and login credentials from the `.env` file.

2. Go to `Object > Register > Server` and fill in the following details:
   - General:
     - Name: 'Dockerized PostgreSQL' (or any name you like)
   - Connection:
     - Host name/address: `postgres` (the name of the PostgreSQL service in the Docker Compose file)
     - Port: `5432` (the default PostgreSQL port)
     - Username: `postgres_user` (the username from the `.env` file)
     - Password: `postgres_password` (the password from the `.env` file)
     - Save password: `Yes` (or `No` if you prefer to enter the password each time you connect)
3. Save the server and you should be able to see the database and tables in the `Browser` section. From here you can manage the database and tables, run queries, and more.

## Whats next?

I am currently working on creating a serverless version of this project using AWS Lambda, API Gateway, and Aurora. I will also be adding a CI/CD pipeline to deploy the serverless version to AWS. I will be sharing the project in a separate repository:  [blog-aggregator-serverless](https://github.com/1-ashraful-islam/blog-aggregator-serverless.git).
