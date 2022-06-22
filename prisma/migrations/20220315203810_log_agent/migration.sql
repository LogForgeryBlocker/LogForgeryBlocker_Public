/*
  Warnings:

  - Added the required column `agentId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "agentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
