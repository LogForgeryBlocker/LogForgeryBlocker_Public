-- CreateTable
CREATE TABLE "LogVerification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "LogVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogVerification_logId_key" ON "LogVerification"("logId");

-- AddForeignKey
ALTER TABLE "LogVerification" ADD CONSTRAINT "LogVerification_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
