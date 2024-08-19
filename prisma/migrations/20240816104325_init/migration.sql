-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `color` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `contents` VARCHAR(191) NULL,
    `id_proof` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `found_location` VARCHAR(191) NOT NULL,
    `found_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReclaimRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bag_id` INTEGER NOT NULL,
    `requested_by` INTEGER NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LostBag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `color` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `contents` VARCHAR(191) NULL,
    `last_seen_location` VARCHAR(191) NOT NULL,
    `date_time_lost` DATETIME(3) NOT NULL,
    `contact_info` VARCHAR(191) NOT NULL,
    `id_proof` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `reported_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bag` ADD CONSTRAINT `Bag_found_by_fkey` FOREIGN KEY (`found_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReclaimRequest` ADD CONSTRAINT `ReclaimRequest_bag_id_fkey` FOREIGN KEY (`bag_id`) REFERENCES `Bag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReclaimRequest` ADD CONSTRAINT `ReclaimRequest_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LostBag` ADD CONSTRAINT `LostBag_reported_by_fkey` FOREIGN KEY (`reported_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
