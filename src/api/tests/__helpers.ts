import getPort, { makeRange } from "get-port";
import { GraphQLClient } from "graphql-request";
import { startStandaloneServer } from "@apollo/server/standalone";
import { TestingContext } from "../../api/context";
import { ApolloServer } from "@apollo/server";
import { schema } from "../../graphql/schema";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

type TestContext = {
  client: GraphQLClient;
  prisma: PrismaClient;
};
interface TestContentArgs {
  portRange: {
    from: number;
    to: number;
  }
}

const prismaBinary = join(__dirname, "../../..", "node_modules", ".bin", "prisma");

export function createTestContext(arg: TestContentArgs ): TestContext {
  let ctx = {} as TestContext;

  const prismaCtx = prismaTestContext();
  const graphqlCtx = graphqlTestContext(arg);
  execSync(`${prismaBinary} db push `,);


  beforeEach(async () => {
    const client = await graphqlCtx.before();
    const prisma = await prismaCtx.before();

    Object.assign(ctx, {
      client,
      prisma
    });
  });
  afterEach(async () => {
    await graphqlCtx.after();
    await prismaCtx.after();
  });
  return ctx;
}

function graphqlTestContext({ portRange: { from, to }}:TestContentArgs) {
  let serverInstance: ApolloServer<TestingContext> | null = null;
  let urlInst: string | null = null;
  let prisma: null | PrismaClient = null;
  return {
    async before() {
      serverInstance = new ApolloServer<TestingContext>({
        schema,
      });

      prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_TEST_URL
          }
        }
      });
      const port = await getPort({ port: makeRange(from, to) });

      const { url } = await startStandaloneServer<TestingContext>(serverInstance, {
        listen: { port },
        context: async ({ req, res }) => ({ req, res, prisma: prisma as PrismaClient })
      });
      urlInst = url;

      console.log(`🚀  Test Server ready at: ${urlInst}`);
      return new GraphQLClient(urlInst);

    },
    async after() {
      //console.log(`🚀  Stopped Server at: ${urlInst}`);
      await prisma?.$disconnect();
      await serverInstance?.stop();
    },
  };
}


function prismaTestContext() {
  let prismaClient: null | PrismaClient = null;
  return {
    async before() {
      prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_TEST_URL
          }
        }
      });
      execSync(`${prismaBinary} db seed `,);
      return prismaClient;
    },
    async after() {
      await prismaClient?.$disconnect();
    },
  };
}
