-- AlterTable
ALTER TABLE `kreditur` ADD COLUMN `limit_pengajuan` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `limit_tenor` INTEGER NOT NULL DEFAULT 12;

-- AlterTable
ALTER TABLE `survey_lapangan` ADD COLUMN `id_sub_hunian` INTEGER NULL,
    ADD COLUMN `id_sub_pekerjaan` INTEGER NULL,
    ADD COLUMN `id_sub_pendapatan` INTEGER NULL,
    ADD COLUMN `id_sub_tanggungan` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `survey_lapangan` ADD CONSTRAINT `survey_lapangan_id_sub_pendapatan_fkey` FOREIGN KEY (`id_sub_pendapatan`) REFERENCES `sub_kriteria`(`id_sub`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_lapangan` ADD CONSTRAINT `survey_lapangan_id_sub_hunian_fkey` FOREIGN KEY (`id_sub_hunian`) REFERENCES `sub_kriteria`(`id_sub`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_lapangan` ADD CONSTRAINT `survey_lapangan_id_sub_pekerjaan_fkey` FOREIGN KEY (`id_sub_pekerjaan`) REFERENCES `sub_kriteria`(`id_sub`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_lapangan` ADD CONSTRAINT `survey_lapangan_id_sub_tanggungan_fkey` FOREIGN KEY (`id_sub_tanggungan`) REFERENCES `sub_kriteria`(`id_sub`) ON DELETE SET NULL ON UPDATE CASCADE;
