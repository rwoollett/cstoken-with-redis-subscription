import { PrismaClient } from "../lib/prismaClient";
import { RedisPubSub  } from 'graphql-redis-subscriptions';

export interface Context {
  prisma: PrismaClient;
  pubsub: RedisPubSub;
}

export interface TestingContext {
  prisma: PrismaClient;
}
