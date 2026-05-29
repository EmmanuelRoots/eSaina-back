-- CreateEnum
CREATE TYPE "public"."StatusCategory" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "statusId" TEXT;

-- CreateTable
CREATE TABLE "public"."ProjectStatus" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#94a3b8',
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" "public"."StatusCategory" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectStatus_projectId_idx" ON "public"."ProjectStatus"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectStatus_projectId_name_key" ON "public"."ProjectStatus"("projectId", "name");

-- CreateIndex
CREATE INDEX "Issue_statusId_idx" ON "public"."Issue"("statusId");

-- AddForeignKey
ALTER TABLE "public"."ProjectStatus" ADD CONSTRAINT "ProjectStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."ProjectStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
