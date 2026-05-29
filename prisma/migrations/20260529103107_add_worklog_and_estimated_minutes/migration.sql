-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "estimatedMinutes" INTEGER;

-- CreateTable
CREATE TABLE "public"."WorkLog" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSpentMinutes" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkLog_issueId_idx" ON "public"."WorkLog"("issueId");

-- CreateIndex
CREATE INDEX "WorkLog_userId_idx" ON "public"."WorkLog"("userId");

-- AddForeignKey
ALTER TABLE "public"."WorkLog" ADD CONSTRAINT "WorkLog_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkLog" ADD CONSTRAINT "WorkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
