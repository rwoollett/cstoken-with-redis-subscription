import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaTest = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_TEST_URL
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
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (7010);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (7020);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (7030);  `;
  await prismaTest.$executeRaw` INSERT INTO public."RequestParent"("clientIp") VALUES (7040);  `;

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
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	host, ip, name, connected, "parentIp")	VALUES ('netproc7010', 7010, 'netproc7010', false, 7010);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	host, ip, name, connected, "parentIp")	VALUES ('netproc7020', 7020, 'netproc7020', false, 7020);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	host, ip, name, connected, "parentIp")	VALUES ('netproc7030', 7030, 'netproc7030', false, 7030);  `;
  await prismaTest.$executeRaw` INSERT INTO public."Client"(	host, ip, name, connected, "parentIp")	VALUES ('netproc7040', 7040, 'netproc7040', false, 7040);  `;
  prismaTest.$disconnect();

})();

export { };