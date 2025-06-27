import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppTutorialPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Panduan Penggunaan Aplikasi
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Berikut panduan untuk setiap peran pengguna aplikasi.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Admin */}
            <AccordionItem value="admin">
              <AccordionTrigger>🛠️ Admin</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Melihat dan menambahkan kelas di menu{" "}
                    <strong>Daftar Kelas</strong>
                  </li>
                  <li>Menambahkan siswa ke dalam kelas</li>
                  <li>
                    Mengelola tagihan siswa di menu <strong>Finances</strong>
                  </li>
                  <li>
                    Melihat semua kegiatan di menu <strong>Kegiatan</strong>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Orang Tua */}
            <AccordionItem value="parent">
              <AccordionTrigger>👨‍👩‍👧 Orang Tua</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Melihat daftar tagihan anak di menu{" "}
                    <strong>Pembayaran</strong>
                  </li>
                  <li>
                    Melakukan pembayaran menggunakan metode{" "}
                    <strong>Transfer Bank</strong> atau <strong>QRIS</strong>
                  </li>
                  <li>Melihat riwayat pembayaran setelah berhasil</li>
                  <li>
                    Menambahkan data anak di menu{" "}
                    <strong>Daftarkan Anak</strong>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Guru */}
            <AccordionItem value="teacher">
              <AccordionTrigger>👩‍🏫 Guru</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Melihat dashboard untuk ringkasan kelas dan kegiatan</li>
                  <li>Melihat daftar siswa di kelas yang diajar</li>
                  <li>Mengakses panduan penggunaan dari menu ini</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
