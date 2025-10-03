/*
  Warnings:

  - The values [REGULAR] on the enum `ConversationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ConversationType_new" AS ENUM ('AI_CHAT', 'DIRECT', 'GROUP');
ALTER TABLE "public"."Conversation" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Conversation" ALTER COLUMN "type" TYPE "public"."ConversationType_new" USING ("type"::text::"public"."ConversationType_new");
ALTER TYPE "public"."ConversationType" RENAME TO "ConversationType_old";
ALTER TYPE "public"."ConversationType_new" RENAME TO "ConversationType";
DROP TYPE "public"."ConversationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropIndex
DROP INDEX "public"."Conversation_userId_idx";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "public"."ConversationMember" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."MemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_userId_key" ON "public"."ConversationMember"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Conversation_ownerId_idx" ON "public"."Conversation"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
