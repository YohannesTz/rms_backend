-- DropIndex
DROP INDEX `Media_roomId_fkey` ON `Media`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` VARCHAR(255) NULL;
