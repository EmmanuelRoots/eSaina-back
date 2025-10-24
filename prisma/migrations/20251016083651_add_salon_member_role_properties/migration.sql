/*
  Warnings:

  - Added the required column `role` to the `SalonMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SalonMember" ADD COLUMN     "role" "public"."SalonMemberRole" NOT NULL;
