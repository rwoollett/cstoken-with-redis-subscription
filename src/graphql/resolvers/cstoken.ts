import { eq } from "lodash";
import { FieldResolver } from "nexus";
import {
  AcquireCSCreatedEvent,
  ClientCSConnectedEvent,
  ClientCSDisconnectedEvent,
  RequestCSCreatedEvent,
  Subjects
} from "../../events";

export const getClientsResolver: FieldResolver<
  "Query",
  "getClients"
> = async (_, { range }, { prisma, pubsub }) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      host: true,
      ip: true,
      connected: true,
      connectedAt: true,
      processId: true,
      disconnectedAt: true,
      RequestParent: true,
    },
    where: {
      ip: {
        lte: range.to.toString(),
        gte: range.from.toString()
      }
    }
  });
  return [...clients].map((client) => (
    {
      ...client,
      connectedAt: client.connectedAt ? client.connectedAt.toISOString() : "",
      disconnectedAt: client.disconnectedAt ? client.disconnectedAt.toISOString() : "",
      requestParent: {
        id: client.RequestParent.id,
        clientIp: client.RequestParent.clientIp
      }
    }
  ));
};

export const createClientResolver: FieldResolver<
  "Mutation", "createClient"
> = async (_, { name, host, ip, connected }, { prisma, pubsub, user }) => {

  if (!user) {
   // throw new Error('Unauthorized');
   console.log("No user is authenticated");
  }
  const isParentRecord = await prisma.requestParent.findFirst({
    where: { clientIp: ip }
  });
  if (isParentRecord === null) {
    await prisma.requestParent.create({
      data: { clientIp: ip }
    });
  }
  const parentRecord = await prisma.requestParent.findFirstOrThrow({
    where: { clientIp: ip }
  });

  const newClient = await prisma.client.create({
    data: {
      name,
      host,
      ip,
      connected,
      parentIp: ip
    }
  });

  return {
    id: newClient.id,
    name,
    host,
    ip,
    connected,
    connectedAt: newClient.connectedAt ? newClient.connectedAt.toISOString() : "",
    disconnectedAt: newClient.disconnectedAt ? newClient.disconnectedAt.toISOString() : "",
    requestParent: {
      id: parentRecord.id,
      clientIp: parentRecord.clientIp
    }
  }
};

export const connectClientCSResolver: FieldResolver<
  "Mutation", "connectClientCS"
> = async (_, { sourceIp, processId }, { prisma, pubsub }) => {

  const connectedAt = new Date().toISOString();
  await prisma.client.update({
    where: {
      ip: sourceIp
    },
    data: {
      ip: sourceIp,
      connected: true,
      connectedAt: connectedAt,
      processId
    }
  });


  pubsub && pubsub.publish(Subjects.ClientCSConnected,
    {
      subject: Subjects.ClientCSConnected,
      data: { sourceIp, connectedAt, processId }
    } as ClientCSConnectedEvent);

  return { sourceIp, connectedAt, processId }
};

export const disconnectClientCSResolver: FieldResolver<
  "Mutation", "disconnectClientCS"
> = async (_, { sourceIp }, { prisma, pubsub }) => {

  const disconnectedAt = new Date().toISOString();
  await prisma.client.update({
    where: {
      ip: sourceIp
    },
    data: {
      ip: sourceIp,
      connected: false,
      processId: null,
      disconnectedAt: disconnectedAt
    }
  });


  pubsub && pubsub.publish(Subjects.ClientCSDisconnected,
    {
      subject: Subjects.ClientCSDisconnected,
      data: { sourceIp, disconnectedAt }
    } as ClientCSDisconnectedEvent);

  return { sourceIp, disconnectedAt }
};

export const createRequestCSResolver: FieldResolver<
  "Mutation", "createRequestCS"
> = async (_, { sourceIp, originalIp, parentIp, relayed }, { pubsub }) => {
  const requestedAt = new Date().toISOString();

  pubsub && pubsub.publish(Subjects.RequestCSCreated,
    {
      subject: Subjects.RequestCSCreated,
      data: { sourceIp, originalIp, parentIp, requestedAt, relayed }
    } as RequestCSCreatedEvent);

  return { sourceIp, originalIp, parentIp, requestedAt, relayed }
};


export const createAcquireCSResolver: FieldResolver<
  "Mutation", "createAcquireCS"
> = async (_, { ip, sourceIp }, { pubsub }) => {
  const acquiredAt = new Date().toISOString();

  pubsub && pubsub.publish(Subjects.AcquireCSCreated,
    {
      subject: Subjects.AcquireCSCreated,
      data: { ip, sourceIp, acquiredAt }
    } as AcquireCSCreatedEvent);

  return { ip, sourceIp, acquiredAt }
};

export const subcribeConnectedCSResolver = (payload: ClientCSConnectedEvent) => {
  const { sourceIp, processId, connectedAt } = payload.data;
  return { sourceIp, processId, connectedAt };
};

export const subcribeDisconnectedCSResolver = (payload: ClientCSDisconnectedEvent) => {
  const { sourceIp, disconnectedAt } = payload.data;
  return { sourceIp, disconnectedAt };
};

export const subcribeRequestCSResolver = (payload: RequestCSCreatedEvent) => {
  const { data: requestCS } = payload;
  return {
    sourceIp: requestCS.sourceIp,
    originalIp: requestCS.originalIp,
    parentIp: requestCS.parentIp,
    requestedAt: requestCS.requestedAt,
    relayed: requestCS.relayed
  };
};

export const subcribeAcquireCSResolver = (payload: AcquireCSCreatedEvent) => {
  const { data: acquireCS } = payload;
  return {
    ip: acquireCS.ip,
    sourceIp: acquireCS.sourceIp,
    acquiredAt: acquireCS.acquiredAt
  };
};

