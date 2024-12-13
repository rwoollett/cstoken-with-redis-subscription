import { makeSchema } from "nexus";
import { join } from "path";
import * as types from './types';

const schema = makeSchema({
  types,
  contextType: {
    module: join(process.cwd(), './src/api/context.ts'),
    export: "Context",
  },
  outputs: {
    typegen: join(process.cwd(), './src/generated/nexus-typegen.ts'),
    schema: join(process.cwd(), './src/generated/schema.graphql'),
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});

export { schema };