import { PrismaClient } from "../lib/prismaClient";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import jwt from 'jsonwebtoken';
import express from 'express';

export interface Context {
  prisma: PrismaClient;
  pubsub: RedisPubSub;
  user: string | jwt.JwtPayload | null;
}

export type ContextFunction = (
  args: {
    req?: express.Request;
    connectionParams?: any
  }) => Promise<Context>;

export interface TestingContext {
  prisma: PrismaClient;
}
