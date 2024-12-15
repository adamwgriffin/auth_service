# Auth Service

A service for authenticating users.

## Setup

Create a .env file for the app secrets. You can use the env.example file in this directory as a template.

Add a username/password to DB_USER and DB_PASSWORD in the .env file.

Generate the secret to use with JWT.
```
openssl rand -base64 32
```
Add the secret to the JWT_SECRET environment variable in your .env file.
```
JWT_SECRET=string_generated_by_openssl
```

## Dev

Run the app in dev:
```
docker-compose up
```

Run tests:
```
yarn test
```
