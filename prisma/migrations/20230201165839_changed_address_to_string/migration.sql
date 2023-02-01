-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_room_id_fkey`;

-- AlterTable
ALTER TABLE `Room` ADD COLUMN `address` VARCHAR(255) NULL;
