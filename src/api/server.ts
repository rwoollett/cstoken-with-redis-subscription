import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Context } from './context';
import { schema } from '../graphql/schema';
import { prisma } from "../lib/prismaClient";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const PORT = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)


//function start() {

if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_HOST must be defined');
}
if (!process.env.REDIS_PORT) {
  throw new Error('REDIS_PORT must be defined');
}
if (!process.env.REDIS_PASS) {
  throw new Error('REDIS_PASS must be defined');
}
const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT as unknown as number,
  password: process.env.REDIS_PASS,
  lazyConnect: true,
  keepAlive: 1000,
};

const context: Context = {
  prisma: prisma,
  pubsub: new RedisPubSub({
    connectionListener(err) {
      console.log("Connection listened:" ,err.message);
    },
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions)
  })
}

/** Create WS Server */
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

/** hand-in created schema and have the WS Server start listening */
const serverCleanup = useServer({ schema, context }, wsServer)

const server = new ApolloServer<Context>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
})

server.start().then(() => {

  app.use('/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, { context: async () => context })
  );

  const mainServer = httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  })

  let closed: boolean[] = [false, false, false];
  process.on('SIGINT', async function () {
    try {
      !closed[0] && mainServer.close(async () => {
        console.log('Closing  http listener');
        closed[0] = true;
      })
      await server.stop();
      console.log('Stopped Process');
      closed[1] = true;
    } catch (err) {
      console.log('Process exit', err);
    }
  });

  process.addListener("uncaughtException", () => {
    console.log('somethus');
    process.exit();
  });

}).catch((e) => {
  console.log('ERROR', e);
});;

