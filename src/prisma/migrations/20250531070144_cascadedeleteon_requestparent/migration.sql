-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_parentIp_fkey";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_parentIp_fkey" FOREIGN KEY ("parentIp") REFERENCES "RequestParent"("clientIp") ON DELETE CASCADE ON UPDATE CASCADE;
