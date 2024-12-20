/*
  Warnings:

  - You are about to alter the column `ip` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `clientId` on the `requestCS` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `requestCS` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `requestCS` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originatorIp` to the `requestCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentIp` to the `requestCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceIp` to the `requestCS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requestCS" DROP CONSTRAINT "requestCS_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "ip" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "requestCS" DROP COLUMN "clientId",
DROP COLUMN "message",
DROP COLUMN "publishedAt",
ADD COLUMN     "originatorIp" TEXT NOT NULL,
ADD COLUMN     "parentIp" TEXT NOT NULL,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sourceIp" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_ip_key" ON "Client"("ip");

-- AddForeignKey
ALTER TABLE "requestCS" ADD CONSTRAINT "requestCS_sourceIp_fkey" FOREIGN KEY ("sourceIp") REFERENCES "Client"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestCS" ADD CONSTRAINT "requestCS_originatorIp_fkey" FOREIGN KEY ("originatorIp") REFERENCES "Client"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestCS" ADD CONSTRAINT "requestCS_parentIp_fkey" FOREIGN KEY ("parentIp") REFERENCES "Client"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;
