# JWT reference implementation

Requires [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/v17.09/compose/install/) to be installed

## Development

To spin up the servers

```bash
docker-compose up --build
```

To shut down the servers

```bash
docker-compose down
```

## Features

Uses an HttpOnly cookie to store the refresh token, for security reasons.

## References

https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/
