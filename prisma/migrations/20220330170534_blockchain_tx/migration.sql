-- CreateTable
CREATE TABLE "BlockchainTx" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,

    CONSTRAINT "BlockchainTx_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainTx_snapshotId_key" ON "BlockchainTx"("snapshotId");

-- AddForeignKey
ALTER TABLE "BlockchainTx" ADD CONSTRAINT "BlockchainTx_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
