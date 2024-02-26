# Blog Aggregator in Go

[![GoSec Security Scanner](https://github.com/1-ashraful-islam/blog-aggregator/actions/workflows/gosec.yml/badge.svg)](https://github.com/1-ashraful-islam/blog-aggregator/actions/workflows/gosec.yml)

> :loudspeaker: **Announcement**:This project got too big and more complex than I anticipated. I moved this project from the subfolder of [boot.dev-projects](https://github.com/1-ashraful-islam/boot.dev-projects) repository.

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

## Deployment to AWS Lambda

[Go Lambda Instructions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-golang.html)
[AWS CLI V2 SSO Sign on Instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

Compile and deploy to AWS Lambda using the following steps:

1. (optional if configured already) Install AWS CLI v2
2. (optional if configured already) Configure AWS CLI v2 with SSO
   ```aws configure sso```
3. (optional if configured already) `aws sso login --profile <profile-name>`
4. Make sure env variables are set in `.env` file
5. Run the following command:

```bash
sh aws-lambda-deploy.sh
```
