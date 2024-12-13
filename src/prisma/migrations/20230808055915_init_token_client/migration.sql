-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "connected" BOOLEAN NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requestCS" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "requestCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acquireCS" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "acquireCS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requestCS" ADD CONSTRAINT "requestCS_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquireCS" ADD CONSTRAINT "acquireCS_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
