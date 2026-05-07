-- CreateEnum
CREATE TYPE "KudosPostStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'REMOVED');

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "kudos_categories" ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "kudos_posts" ADD COLUMN     "status" "KudosPostStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "point_rules" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "weeklyLimit" INTEGER NOT NULL DEFAULT 10,
    "cooldownHours" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "point_rules_categoryId_key" ON "point_rules"("categoryId");

-- AddForeignKey
ALTER TABLE "point_rules" ADD CONSTRAINT "point_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "kudos_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
