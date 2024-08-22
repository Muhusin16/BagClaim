/*
  Warnings:

  - You are about to drop the column `color` on the `bag` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `bag` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `lostbag` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `lostbag` table. All the data in the column will be lost.
  - Added the required column `category` to the `Bag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_color` to the `Bag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_category` to the `Bag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `LostBag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_color` to the `LostBag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_category` to the `LostBag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reclaimrequest` DROP FOREIGN KEY `ReclaimRequest_bag_id_fkey`;

-- AlterTable
ALTER TABLE `bag` DROP COLUMN `color`,
    DROP COLUMN `type`,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NULL,
    ADD COLUMN `primary_color` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondary_color` VARCHAR(191) NULL,
    ADD COLUMN `serial_number` VARCHAR(191) NULL,
    ADD COLUMN `sub_category` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lostbag` DROP COLUMN `color`,
    DROP COLUMN `type`,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NULL,
    ADD COLUMN `primary_color` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondary_color` VARCHAR(191) NULL,
    ADD COLUMN `serial_number` VARCHAR(191) NULL,
    ADD COLUMN `sub_category` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ReclaimRequest` ADD CONSTRAINT `ReclaimRequest_bag_id_fkey` FOREIGN KEY (`bag_id`) REFERENCES `Bag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
