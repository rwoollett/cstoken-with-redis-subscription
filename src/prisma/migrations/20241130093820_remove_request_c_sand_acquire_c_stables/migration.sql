/*
  Warnings:

  - You are about to drop the `AcquireCS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestCS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcquireCS" DROP CONSTRAINT "AcquireCS_ip_fkey";

-- DropForeignKey
ALTER TABLE "AcquireCS" DROP CONSTRAINT "AcquireCS_sourceIp_fkey";

-- DropForeignKey
ALTER TABLE "RequestCS" DROP CONSTRAINT "RequestCS_parentIp_fkey";

-- DropForeignKey
ALTER TABLE "RequestCS" DROP CONSTRAINT "RequestCS_sourceIp_fkey";

-- DropTable
DROP TABLE "AcquireCS";

-- DropTable
DROP TABLE "RequestCS";
