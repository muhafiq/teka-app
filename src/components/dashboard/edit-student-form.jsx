"use client";

import { useActionState, useEffect } from "react";
import { updateStudent } from "@/lib/actions/students";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditStudentForm({ student }) {
  const [state, formAction, isPending] = useActionState(updateStudent, {
    success: false,
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push(`/dashboard/classrooms/${student.classroomId}/students`);
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="max-w-7xl p-8">
      <CardTitle className="text-xl">Edit Data Siswa</CardTitle>
      <CardDescription>Pastikan mengubah data seperlunya!</CardDescription>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="studentId" value={student.id} />

        <div className="space-y-2">
          <Label htmlFor="name">Nama Anak</Label>
          <Input id="name" name="name" required defaultValue={student.name} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Jenis Kelamin</Label>
            <Select name="gender" defaultValue={student.gender} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="religion">Agama</Label>
            <Select name="religion" defaultValue={student.religion} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Katolik">Katolik</SelectItem>
                <SelectItem value="Hindu/Budha">Hindu/Budha</SelectItem>
                <SelectItem value="Konghucu">Konghucu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat Anak</Label>
          <Textarea
            id="address"
            name="address"
            required
            defaultValue={student.address}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthPlace">Tempat Lahir</Label>
            <Input
              id="birthPlace"
              name="birthPlace"
              required
              defaultValue={student.birthPlace}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Tanggal Lahir</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              defaultValue={student.birthDate?.split("T")[0]} // ISO date
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nation">Kebangsaan</Label>
          <Input
            id="nation"
            name="nation"
            required
            defaultValue={student.nation}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uniformSize">Ukuran Seragam</Label>
          <Select
            name="uniformSize"
            defaultValue={student.uniformSize}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spesificDesease">Penyakit Khusus (jika ada)</Label>
          <Input
            id="spesificDesease"
            name="spesificDesease"
            defaultValue={student.spesificDesease || ""}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="disabled"
            name="disabled"
            defaultChecked={student.disabled}
            className="rounded border-gray-300"
          />
          <Label htmlFor="disabled" className="text-sm text-gray-700">
            Anak Difabel
          </Label>
        </div>

        {/* Upload dokumen baru (jika perlu ubah) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kartuKeluarga">Ubah Kartu Keluarga</Label>
            <Input
              id="kartuKeluarga"
              name="kartuKeluarga"
              type="file"
              accept="image/*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aktaKelahiran">Ubah Akta Kelahiran</Label>
            <Input
              id="aktaKelahiran"
              name="aktaKelahiran"
              type="file"
              accept="image/*"
            />
          </div>
        </div>

        {!state.success && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <Button type="submit" className="w-full self-end" disabled={isPending}>
          {isPending ? "Menyimpan perubahan..." : "Perbarui Data"}
        </Button>
      </form>
    </Card>
  );
}
