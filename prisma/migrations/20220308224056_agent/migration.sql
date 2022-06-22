/*
  Warnings:

  - You are about to drop the column `end` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Snapshot` table. All the data in the column will be lost.
  - Added the required column `firstLine` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastLine` to the `Snapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "firstLine" INTEGER NOT NULL,
ADD COLUMN     "lastLine" INTEGER NOT NULL;
