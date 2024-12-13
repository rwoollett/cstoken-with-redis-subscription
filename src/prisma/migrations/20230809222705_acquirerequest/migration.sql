/*
  Warnings:

  - You are about to drop the column `clientId` on the `AcquireCS` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `AcquireCS` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `AcquireCS` table. All the data in the column will be lost.
  - Added the required column `ip` to the `AcquireCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceIp` to the `AcquireCS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcquireCS" DROP CONSTRAINT "AcquireCS_clientId_fkey";

-- AlterTable
ALTER TABLE "AcquireCS" DROP COLUMN "clientId",
DROP COLUMN "message",
DROP COLUMN "publishedAt",
ADD COLUMN     "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "sourceIp" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AcquireCS" ADD CONSTRAINT "AcquireCS_ip_fkey" FOREIGN KEY ("ip") REFERENCES "Client"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquireCS" ADD CONSTRAINT "AcquireCS_sourceIp_fkey" FOREIGN KEY ("sourceIp") REFERENCES "RequestParent"("clientIp") ON DELETE RESTRICT ON UPDATE CASCADE;
