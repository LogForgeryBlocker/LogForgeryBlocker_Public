-- CreateTable
CREATE TABLE "AgentLogDeadline" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLogDeadline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentLogDeadline_agentId_key" ON "AgentLogDeadline"("agentId");
