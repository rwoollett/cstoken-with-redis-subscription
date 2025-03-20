import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaTest = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  await prismaTest.$executeRaw`
  TRUNCATE TABLE "RequestParent" RESTART IDENTITY CASCADE;
  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5010);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5020);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5030);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5040);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5050);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5060);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5070);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (5080);  `;

  await prismaTest.$executeRaw`
  TRUNCATE TABLE "Client" RESTART IDENTITY CASCADE;
  `;
  
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5010, 'Lemon', false, 5010);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5020, 'Orange', false, 5020);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5030, 'Pear', false, 5030);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5040, 'Lime', false, 5040);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5050, 'Strawberry', false, 5050);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5060, 'Grape', false, 5060);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5070, 'Manderine', false, 5070);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	ip, name, connected, "parentIp")	VALUES (5080, 'Apple', false, 5080);  `;
  prismaTest.$disconnect();

})();

export { };