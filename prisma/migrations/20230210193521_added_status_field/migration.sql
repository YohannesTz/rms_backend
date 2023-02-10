/*
  Warnings:

  - Added the required column `status` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_landLordId_fkey`;

-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `status` VARCHAR(255) NOT NULL;

-- RenameIndex
ALTER TABLE `Reservation` RENAME INDEX `Reservation_roomId_fkey` TO `Reservation_roomId_idx`;

-- RenameIndex
ALTER TABLE `Reservation` RENAME INDEX `Reservation_userId_fkey` TO `Reservation_userId_idx`;

-- RenameIndex
ALTER TABLE `Review` RENAME INDEX `Review_room_id_fkey` TO `Review_room_id_idx`;

-- RenameIndex
ALTER TABLE `Room` RENAME INDEX `Room_landLordId_fkey` TO `Room_landLordId_idx`;
