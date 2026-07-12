import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/security.js";
const prisma = new PrismaClient();
async function main() {
    console.log("=== MEMULAI PROSES SEEDING DATABASE ===");
    // 1. Seed Bobot GAP
    const gapData = [
        { selisihGap: 0, bobotNilai: 5.0, keterangan: "Sesuai target (tidak ada selisih)" },
        { selisihGap: 1, bobotNilai: 4.5, keterangan: "Kelebihan 1 tingkat" },
        { selisihGap: -1, bobotNilai: 4.0, keterangan: "Kekurangan 1 tingkat" },
        { selisihGap: 2, bobotNilai: 3.5, keterangan: "Kelebihan 2 tingkat" },
        { selisihGap: -2, bobotNilai: 3.0, keterangan: "Kekurangan 2 tingkat" },
        { selisihGap: 3, bobotNilai: 2.5, keterangan: "Kelebihan 3 tingkat" },
        { selisihGap: -3, bobotNilai: 2.0, keterangan: "Kekurangan 3 tingkat" },
        { selisihGap: 4, bobotNilai: 1.5, keterangan: "Kelebihan 4 tingkat" },
        { selisihGap: -4, bobotNilai: 1.0, keterangan: "Kekurangan 4 tingkat" },
    ];
    console.log("Seeding BobotGap...");
    for (const gd of gapData) {
        await prisma.bobotGap.create({
            data: {
                selisihGap: gd.selisihGap,
                bobotNilai: gd.bobotNilai,
                keterangan: gd.keterangan
            }
        });
    }
    // 2. Seed Penyedia Jasa
    console.log("Seeding PenyediaJasa...");
    const pj = await prisma.penyediaJasa.create({
        data: {
            namaPenyediaJasa: "IndoFund Financial",
            alamat: "Gedung Sahid Sudirman Center Lt. 23, Jakarta Selatan",
            limitPengajuan: 200000000,
            limitTenor: 60,
            persentaseCf: 60.00,
            persentaseSf: 40.00
        }
    });
    // 3. Seed Users (Super Admin & Admin Mitra)
    console.log("Seeding Users...");
    const hashedDefaultPassword = await hashPassword("password");
    // Super Admin
    await prisma.users.create({
        data: {
            username: "superadmin",
            email: "superadmin@jakwir.id",
            password: hashedDefaultPassword,
            role: "SUPER_ADMIN"
        }
    });
    // Admin Penyedia Jasa
    await prisma.users.create({
        data: {
            username: "admin_indofund",
            email: "admin@indofund.id",
            password: hashedDefaultPassword,
            role: "ADMIN",
            idPenyediaJasa: pj.idPenyediaJasa
        }
    });
    // 4. Seed Kriteria & Sub-Kriteria (Fix 6 Kriteria, 5 Sub-Kriteria per kriteria)
    console.log("Seeding Kriteria SPK...");
    // C1: Jumlah Tanggungan
    const c1 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C1",
            namaKriteria: "Jumlah Tanggungan",
            nilaiTarget: 3,
            jenisFaktor: "SECONDARY"
        }
    });
    const c1Subs = [
        { deskripsi: "Tidak ada tanggungan (0)", nilaiRating: 1 },
        { deskripsi: "1 orang", nilaiRating: 2 },
        { deskripsi: "2 orang", nilaiRating: 3 },
        { deskripsi: "3 - 4 orang", nilaiRating: 4 },
        { deskripsi: "> 4 orang", nilaiRating: 5 },
    ];
    for (const cs of c1Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c1.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    // C4: Status Hunian
    const c4 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C4",
            namaKriteria: "Status Hunian",
            nilaiTarget: 4,
            jenisFaktor: "SECONDARY"
        }
    });
    const c4Subs = [
        { deskripsi: "Kos / Menumpang", nilaiRating: 1 },
        { deskripsi: "Sewa Tahunan / Kontrakan", nilaiRating: 2 },
        { deskripsi: "Rumah Dinas / KPR berjalan", nilaiRating: 3 },
        { deskripsi: "Milik Keluarga inti atau Orang tua", nilaiRating: 4 },
        { deskripsi: "Milik Sendiri (BerSHM)", nilaiRating: 5 },
    ];
    for (const cs of c4Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c4.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    // C3: Pendapatan Bersih
    const c3 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C3",
            namaKriteria: "Pendapatan Bersih",
            nilaiTarget: 3,
            jenisFaktor: "CORE"
        }
    });
    const c3Subs = [
        { deskripsi: "< Rp 3.000.000", nilaiRating: 1 },
        { deskripsi: "Rp 3.000.000 - Rp 5.000.000", nilaiRating: 2 },
        { deskripsi: "Rp 5.000.000 - Rp 10.000.000", nilaiRating: 3 },
        { deskripsi: "Rp 10.000.000 - Rp 15.000.000", nilaiRating: 4 },
        { deskripsi: "> Rp 15.000.000", nilaiRating: 5 },
    ];
    for (const cs of c3Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c3.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    // C2: Rasio Hutang
    const c2 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C2",
            namaKriteria: "Rasio Hutang",
            nilaiTarget: 2,
            jenisFaktor: "CORE"
        }
    });
    const c2Subs = [
        { deskripsi: "Sangat Rendah (< 10%)", nilaiRating: 1 },
        { deskripsi: "Rendah (10% - 30%)", nilaiRating: 2 },
        { deskripsi: "Sedang (30% - 40%)", nilaiRating: 3 },
        { deskripsi: "Tinggi (40% - 60%)", nilaiRating: 4 },
        { deskripsi: "Sangat Tinggi (> 60%)", nilaiRating: 5 },
    ];
    for (const cs of c2Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c2.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    // C5: Jaminan
    const c5 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C5",
            namaKriteria: "Jaminan",
            nilaiTarget: 4,
            jenisFaktor: "SECONDARY"
        }
    });
    const c5Subs = [
        { deskripsi: "< 50% dari nilai pinjaman", nilaiRating: 1 },
        { deskripsi: "50% - 75% dari nilai pinjaman", nilaiRating: 2 },
        { deskripsi: "75% - 100% dari nilai pinjaman", nilaiRating: 3 },
        { deskripsi: "100% - 125% dari nilai pinjaman", nilaiRating: 4 },
        { deskripsi: "> 125% dari nilai pinjaman", nilaiRating: 5 },
    ];
    for (const cs of c5Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c5.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    // C6: Status Pekerjaan
    const c6 = await prisma.kriteria.create({
        data: {
            idPenyediaJasa: pj.idPenyediaJasa,
            kodeKriteria: "C6",
            namaKriteria: "Status Pekerjaan",
            nilaiTarget: 4,
            jenisFaktor: "CORE"
        }
    });
    const c6Subs = [
        { deskripsi: "Pengangguran / Tidak tetap", nilaiRating: 1 },
        { deskripsi: "Pekerja lepas / usaha < 1 tahun", nilaiRating: 2 },
        { deskripsi: "Pegawai kontrak / Usaha 1 - 3 tahun", nilaiRating: 3 },
        { deskripsi: "Pegawai tetap / Usaha berizin > 3 tahun", nilaiRating: 4 },
        { deskripsi: "PNS / TNI / POLRI / BUMN", nilaiRating: 5 },
    ];
    for (const cs of c6Subs) {
        await prisma.subKriteria.create({
            data: {
                idKriteria: c6.idKriteria,
                deskripsi: cs.deskripsi,
                nilaiRating: cs.nilaiRating
            }
        });
    }
    console.log("=== PROSES SEEDING DATABASE SELESAI ===");
}
main()
    .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map