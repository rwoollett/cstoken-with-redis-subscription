/*
  Warnings:

  - You are about to drop the `acquireCS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestCS` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[parentIp]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentIp` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "acquireCS" DROP CONSTRAINT "acquireCS_clientId_fkey";

-- DropForeignKey
ALTER TABLE "requestCS" DROP CONSTRAINT "requestCS_originatorIp_fkey";

-- DropForeignKey
ALTER TABLE "requestCS" DROP CONSTRAINT "requestCS_parentIp_fkey";

-- DropForeignKey
ALTER TABLE "requestCS" DROP CONSTRAINT "requestCS_sourceIp_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "parentIp" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "acquireCS";

-- DropTable
DROP TABLE "requestCS";

-- CreateTable
CREATE TABLE "RequestParent" (
    "id" SERIAL NOT NULL,
    "clientIp" VARCHAR(50) NOT NULL,

    CONSTRAINT "RequestParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestCS" (
    "id" SERIAL NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relayed" BOOLEAN NOT NULL DEFAULT false,
    "sourceIp" TEXT NOT NULL,
    "parentIp" TEXT NOT NULL,

    CONSTRAINT "RequestCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquireCS" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "AcquireCS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestParent_clientIp_key" ON "RequestParent"("clientIp");

-- CreateIndex
CREATE UNIQUE INDEX "Client_parentIp_key" ON "Client"("parentIp");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_parentIp_fkey" FOREIGN KEY ("parentIp") REFERENCES "RequestParent"("clientIp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCS" ADD CONSTRAINT "RequestCS_sourceIp_fkey" FOREIGN KEY ("sourceIp") REFERENCES "Client"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestCS" ADD CONSTRAINT "RequestCS_parentIp_fkey" FOREIGN KEY ("parentIp") REFERENCES "RequestParent"("clientIp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquireCS" ADD CONSTRAINT "AcquireCS_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
