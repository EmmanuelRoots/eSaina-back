/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Salon` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SalonMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "public"."Salon" DROP CONSTRAINT "Salon_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Salon" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "public"."SalonMember" (
    "id" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SalonMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SalonMember" ADD CONSTRAINT "SalonMember_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "public"."Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SalonMember" ADD CONSTRAINT "SalonMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
