-- CreateTable
CREATE TABLE "AgentConfig" (
    "id" TEXT NOT NULL,
    "maxRecordCount" INTEGER NOT NULL,
    "snapshotInterval" INTEGER NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "AgentConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentConfig_agentId_key" ON "AgentConfig"("agentId");

-- AddForeignKey
ALTER TABLE "AgentConfig" ADD CONSTRAINT "AgentConfig_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
