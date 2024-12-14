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

// const publishClient = new Redis(redisOptions);
// publishClient.on('error', (err) => console.log('Redis publish error', err));
// const subscribeClient = new Redis(redisOptions);
// subscribeClient.on('error', (err) => console.log('Redis subscribe error', err));

const redisPubSub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions)
});
redisPubSub.getPublisher().on('error', (err) => console.log('Redis publish error', err));
redisPubSub.getSubscriber().on('error', (err) => console.log('Redis subscribe error', err));

const context: Context = {
  prisma: prisma,
  pubsub: redisPubSub
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

const mainServer = httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
})

function start() {

  server.start().then(() => {
    console.log('setting /grapghql');
    app.use('/graphql',
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, { context: async () => context })
    );
  }).catch((e) => {
    console.log('ERROR', e);
  }).finally(() => {
    console.log('Apollo GrapghQL server running.');
    console.log('Ctrl-C to stop.')
  });


  process.on('SIGINT', function () {

    redisPubSub.close().then(() => {
      console.log('Close Redis Subscription');
    }).catch((err) => {
      console.log('Redis qraph subscription close error', err)
    });
    server.stop().then(() => {
      console.log('Close Apollo GrapghQL');
    });
    mainServer.close(async () => {
      console.log('Closing Http Server');
    });

  });

}

start();
