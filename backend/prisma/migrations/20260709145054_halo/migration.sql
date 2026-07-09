-- CreateTable
CREATE TABLE `kreditur` (
    `id_kreditur` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_perusahaan` VARCHAR(50) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `status_aktif` ENUM('AKTIF', 'TIDAK AKTIF') NOT NULL DEFAULT 'AKTIF',

    PRIMARY KEY (`id_kreditur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aspek` (
    `id_aspek` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kreditur` INTEGER NOT NULL,
    `nama_aspek` VARCHAR(50) NOT NULL,
    `persentase_cf` DECIMAL(5, 2) NOT NULL,
    `persentase_sf` DECIMAL(5, 2) NOT NULL,
    `bobot_aspek` DECIMAL(5, 2) NOT NULL,

    PRIMARY KEY (`id_aspek`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria` (
    `id_kriteria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aspek` INTEGER NOT NULL,
    `kode_kriteria` CHAR(5) NOT NULL,
    `nama_kriteria` VARCHAR(100) NOT NULL,
    `nilai_target` INTEGER NOT NULL,
    `jenis_faktor` ENUM('CORE', 'SECONDARY') NOT NULL,

    PRIMARY KEY (`id_kriteria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_kriteria` (
    `id_sub` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kriteria` INTEGER NOT NULL,
    `deskripsi` VARCHAR(255) NOT NULL,
    `nilai_rating` INTEGER NOT NULL,

    PRIMARY KEY (`id_sub`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `debitur` (
    `id_debitur` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_debitur` VARCHAR(50) NOT NULL,
    `nik` VARCHAR(255) NOT NULL,
    `telepon` VARCHAR(20) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `debitur_email_key`(`email`),
    PRIMARY KEY (`id_debitur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengajuan` (
    `id_pengajuan` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pengajuan` DATE NOT NULL,
    `status_peminjaman` ENUM('DITERIMA', 'DITOLAK', 'DIPROSES') NOT NULL DEFAULT 'DIPROSES',
    `id_debitur` INTEGER NOT NULL,
    `id_kreditur` INTEGER NOT NULL,
    `jumlah_kredit` DECIMAL(15, 2) NOT NULL,
    `lama_tenor` INTEGER NOT NULL,

    PRIMARY KEY (`id_pengajuan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_lapangan` (
    `id_survey` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengajuan` INTEGER NOT NULL,
    `total_aset` DECIMAL(15, 2) NOT NULL,
    `pendapatan_bersih` DECIMAL(15, 2) NOT NULL,
    `status_hunian` ENUM('MILIK_SENDIRI', 'SEWA', 'KONTRAK', 'BERSAMA_ORANG_TUA') NOT NULL,
    `status_pekerjaan` ENUM('KARYAWAN_TETAP', 'KARYAWAN_KONTRAK', 'WIRAUSAHA', 'TIDAK_BEKERJA') NOT NULL,
    `jumlah_tanggungan` INTEGER NOT NULL,
    `nilai_jaminan_aset` DECIMAL(15, 2) NOT NULL,
    `rasio_hutang` DECIMAL(5, 2) NOT NULL,
    `persentase_jaminan` DECIMAL(5, 2) NOT NULL,
    `skor_profile_matching` DECIMAL(5, 2) NOT NULL,
    `tingkat_risiko` ENUM('RENDAH', 'MENENGAH', 'TINGGI') NOT NULL,

    UNIQUE INDEX `survey_lapangan_id_pengajuan_key`(`id_pengajuan`),
    PRIMARY KEY (`id_survey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penilaian` (
    `id_penilaian` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengajuan` INTEGER NOT NULL,
    `id_sub` INTEGER NOT NULL,

    PRIMARY KEY (`id_penilaian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bobot_gap` (
    `id_bobot_gap` INTEGER NOT NULL AUTO_INCREMENT,
    `selisih_gap` INTEGER NOT NULL,
    `bobot_nilai` DECIMAL(4, 2) NOT NULL,
    `keterangan` VARCHAR(50) NULL,

    PRIMARY KEY (`id_bobot_gap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `role` ENUM('SUPER ADMIN', 'ADMIN') NOT NULL,
    `id_kreditur` INTEGER NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aspek` ADD CONSTRAINT `aspek_id_kreditur_fkey` FOREIGN KEY (`id_kreditur`) REFERENCES `kreditur`(`id_kreditur`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria` ADD CONSTRAINT `kriteria_id_aspek_fkey` FOREIGN KEY (`id_aspek`) REFERENCES `aspek`(`id_aspek`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_kriteria` ADD CONSTRAINT `sub_kriteria_id_kriteria_fkey` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria`(`id_kriteria`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuan` ADD CONSTRAINT `pengajuan_id_debitur_fkey` FOREIGN KEY (`id_debitur`) REFERENCES `debitur`(`id_debitur`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuan` ADD CONSTRAINT `pengajuan_id_kreditur_fkey` FOREIGN KEY (`id_kreditur`) REFERENCES `kreditur`(`id_kreditur`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_lapangan` ADD CONSTRAINT `survey_lapangan_id_pengajuan_fkey` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuan`(`id_pengajuan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penilaian` ADD CONSTRAINT `penilaian_id_pengajuan_fkey` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuan`(`id_pengajuan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penilaian` ADD CONSTRAINT `penilaian_id_sub_fkey` FOREIGN KEY (`id_sub`) REFERENCES `sub_kriteria`(`id_sub`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_kreditur_fkey` FOREIGN KEY (`id_kreditur`) REFERENCES `kreditur`(`id_kreditur`) ON DELETE CASCADE ON UPDATE CASCADE;
