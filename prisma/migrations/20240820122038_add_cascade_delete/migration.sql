-- DropForeignKey
ALTER TABLE `reclaimrequest` DROP FOREIGN KEY `ReclaimRequest_bag_id_fkey`;

-- AddForeignKey
ALTER TABLE `ReclaimRequest` ADD CONSTRAINT `ReclaimRequest_bag_id_fkey` FOREIGN KEY (`bag_id`) REFERENCES `Bag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
