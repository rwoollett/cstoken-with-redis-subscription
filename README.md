<h1 align="center">CSToken Service wit GraphQL</h1>

<br />
The CSToken GraphQL service uses Nexus schema and Prisma for the SQL database.

The CSToken service holds the network ips available for client appplications
to connect to so they can share resources with a CS token. 
Once connected onto the CSToken service via an ip the application can use the 
service to mutate the request and acquire events to notifiy when they get the CSToken.
The client application is responsible for obtaining the CSToken with the other clients.

The CSToken service is made to be used in a Web Dashboard application to be notified of the
actions made to gain a CSToken. 

<br/>

# Uses Docker Compose

Make docker image in project root folder with: 
```
docker build -t cstoken-dev:v1.0 -f Dockerfile .
```

The docker compose will run the docker image cstoken-dev:v1.0.
Run docker compose with:
```
docker-compose up
```

The compose runtime will generate:
- RabbitMQ service (used for pubsub of events for apollo subscriptions as consumer of published events)
- PostGres database
- Network for the images to be located
- This CSToken qraphql service

## Postgres database instance
When running doocker-compose, the Postgres database can be pushed from the local Postgres database.
In development a local Postgres instance is used, which is then pushed to the docker runtime instance.
```
npx prisma db push
```
Also the databases can be seeded with:
``` 
npx prisma db seed
```

Use the .env file to set the URL variable and use the env variable in ./src/prisma/schema.prisma and ./src/prisma/seed.ts.
## schema.prisma
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```
## seed.ts
```
  const prismaTest = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_TEST_URL
      }
    }
  });
```

# Generate code for CPP
Applications written for accessing the CSToekn apollo query service in C++ can use CaffQL

## Use CaffQL to generate CPP code 
Depends on the application CaffQL to be built in a separate folder.
The git repo can be cloned from (https://github.com/caffeinetv/CaffQL)

Then within the git repo folder (../CaffQL):
```
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -G "Unix Makefiles" . -B ./build-release
cmake --build build-release --target all
```

## CaffQL command line: 
Using the caffql in the cstoken project folder:
```
../CaffQL/build-release/caffql --schema IntrospectionQuery.json --output GeneratedCode.hpp
```

<br />

# 🚀 Available Scripts

In the project directory, you can run:
<br />

## ⚡️ docker-compose up
This requires docker and docker compose installed on your system.

<br />

## ⚡️ dev

```
npm run dev
```

The application depends on a local Postgres database and an instance of Rabbit MQ.
If not present the dev command will error.

Runs the app in the development mode.\
Open [http://localhost:3002/api/graphql](http://localhost:3002/graphql) to view playground.

## Setup RabbitMQ for dev if not using docker-compose
```
docker pull rabbitmq:3
docker run --hostname my-rabbit -p 5672:5672 rabbitmq:3
```

## Setup a Postgres for dev if not using docker-compose
Use a docker container to ease setup of postgres.
Sometimes users will have local postgres installed. It is not required and a docker container can be used.\
An env variable like this required: DATABASE_URL="postgresql://postgres:password@localhost:5432/cstoken?schema=public"

Check the port for connection, "-p <local port>:<image instance exposed port>" in the run command below.\
Usually 5432:5432 is always used. Postgres uses 5432 as the default exposed port in the running container.
Other local postgres instance could be using port 5432, so review your setup.

```
docker pull postgres:14.6    
docker run --name cstoken -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```
When postgres instance is running in docker container the database can be created with:
```
npx prisma db push
```
The file prisma.schema uses env variable DATABASE_URL.

Seed the database for sample client information.
```
npx prisma db seed
```
The file prisma/seed.ts use ENV variable DATABASE_TEST_URL. It can point to the same postgre instance
above in DATABASE_URL if you want the test and dev instance to be the same database.

<br />

```
npm run generate
```

Runs the nexus prisma code generator.

<br />

## 🧪 test

```
npm run test
```
Launches the test runner.

<br />

## 🦾 Start

Will do the same as npm run dev. Uses ts-node instead of ts-node-dev. 
```
npm run start
```

Starts the app for production uses.\

<br />

# 🧬 Project structure

This is the structure of the files in the project:

```sh
    │
    ├── src                     # source files
    │   ├── api
    │   │   ├── tests           # Tests for GraphQL resolvers
    │   │   │   ├── __helpers.ts
    │   │   │   ├── blogs.test.ts
    │   │   │   └── posts.test.ts   
    │   │   ├── context.ts      # Nexus schema for local Apollo GraphQL
    │   │   └── server.ts       # Entry point to server
    │   ├── events              # Folder for message events
    │   ├── generated           # Apollo code generation of typedef and hooks from *.graphql files.
    │   ├── graphql             # GraphQL typedefs and reducers
    │   │   ├── resolvers       # Local schema resolvers for qraphql
    │   │   │   └── cstoken.ts  # Service resolvers for apollo ql   
    │   │   ├── types           # store's actions
    │   │   │   ├── cstoken.ts  # Objects for Apollo QL. Uses prisma database objects for client inforation
    │   │   │   └── index.ts    # index for all typedefs (used in schema.ts)
    │   │   └── schema.ts       # Apollo Server local schema for CSToken service tables (Postgres database)
    │   ├── lib                 # Apollo client/server and Prisma client
    │   │   ├── prismaClient.ts # Prisma client
    │   │   └── rabbitWrapper.ts # RabbitMQ 
    │   ├── prisma
    │   │   ├── migrations
    │   │   ├── schema.prisma   # Prisma SQL schema
    │   │   └── seed.ts         # Seed file for tests on dev SQL source
    │   └── codegen.ts      # Grapgh ql queries hooks and types generator codegen runner
    ├── .dockerignore
    ├── .eslintrc.js
    ├── .gitignore
    ├── docker-compose.yml
    ├── Dockerfile
    ├── IntrospectionQuery.graphql  # Introspection the CSToken service for JSON output
    ├── jest-config.js
    ├── package.json
    ├── README.md
    └── tsconfig.json
```
