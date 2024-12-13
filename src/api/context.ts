import { PrismaClient } from "../lib/prismaClient";
import { AMQPPubSub } from 'graphql-amqp-subscriptions';

export interface Context {
  prisma: PrismaClient;
  pubsub: AMQPPubSub;
}

export interface TestingContext {
  prisma: PrismaClient;
}
