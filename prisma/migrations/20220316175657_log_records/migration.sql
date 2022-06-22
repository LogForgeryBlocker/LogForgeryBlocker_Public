/*
  Warnings:

  - Added the required column `records` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "records" INTEGER NOT NULL;
