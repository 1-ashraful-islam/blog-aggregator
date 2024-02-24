# Blog Aggregator in Go

> :warning: **Announcement**:This project got too big and more complex than I anticipated. I am moving this project to a new repository. You can find the new repository [here](https://github.com/1-ashraful-islam/blog-aggregator.git).

This project is a blog aggregator service in Go. It utilizes RESTful API that fetches data from remote locations and stores them in a production-ready database tools like PostgreSQL, SQLc, Goose, and pgAdmin.

It also utilizes a long-running service worker that reaches out over the internet to fetch data from remote locations.

## Usage

1. Rename the `.env.example` file to `.env` and fill in the required environment variables. Make sure to have proper `DATABASE_NAME` in the `.env` file.

    ```bash
    cp .env.example .env
    ```

2. Run the following command to start postgresql server using docker-compose

    ```bash
    docker-compose up -d
    ```

3. Run the following command to use `goose` to apply migrations

    ```bash
    docker-compose run --rm go-tools goose up
    ```

4. Run the following commands to generate `sqlc` code

    ```bash
    docker-compose run --rm go-tools sqlc generate
    ```

5. Run the following command to stop postgresql server using docker-compose

    ```bash
    docker-compose down
    ```

## Additional Go Tools

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
