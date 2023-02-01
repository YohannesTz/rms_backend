/*
  Warnings:

  - You are about to drop the column `has_air_conditioner` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `longtiude` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `price_perday` on the `Room` table. All the data in the column will be lost.
  - Added the required column `price` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Room` DROP COLUMN `has_air_conditioner`,
    DROP COLUMN `longtiude`,
    DROP COLUMN `price_perday`,
    ADD COLUMN `has_air_con` BOOLEAN NULL,
    ADD COLUMN `longtude` VARCHAR(255) NULL,
    ADD COLUMN `price` INTEGER NOT NULL;
