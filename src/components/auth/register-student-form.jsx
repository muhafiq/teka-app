"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useActionState } from "react";
import { registerStudents } from "@/lib/actions/auth";
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

export default function RegisterStudentForm() {
  const searchParams = useSearchParams();
  const callbackUrl = usePathname();
  const parentId = searchParams.get("parentId");
  const step = searchParams.get("step") || "1";
  const total = searchParams.get("total") || "1";

  const [errorMessage, formAction, isPending] = useActionState(
    registerStudents,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <h1 className="text-md font-bold text-center pb-4">
        Pendaftaran siswa ke-{step} dari total {total} siswa yang ingin
        didaftarkan.
      </h1>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="parentId" value={parentId} />
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="total" value={total} />

      <div className="space-y-2">
        <Label htmlFor="name">Nama Anak</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select name="gender" required>
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
          <Select name="religion" required>
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
        <Textarea id="address" name="address" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthPlace">Tempat Lahir</Label>
          <Input id="birthPlace" name="birthPlace" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Tanggal Lahir</Label>
          <Input id="birthDate" name="birthDate" required type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nation">Kebangsaan</Label>
        <Input id="nation" name="nation" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spesificDesease">Penyakit Khusus (jika ada)</Label>
        <Input id="spesificDesease" name="spesificDesease" />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="disabled"
          name="disabled"
          className="rounded border-gray-300"
        />
        <Label htmlFor="disabled" className="text-sm text-gray-700">
          Anak berkebutuhan khusus
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kartuKeluarga">Upload Kartu Keluarga</Label>
          <Input
            id="kartuKeluarga"
            name="kartuKeluarga"
            type="file"
            required
            accept="image/*"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aktaKelahiran">Upload Akta Kelahiran</Label>
          <Input
            id="aktaKelahiran"
            name="aktaKelahiran"
            type="file"
            required
            accept="image/*"
          />
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? "Menyimpan data..."
          : Number(step) < Number(total)
          ? "Simpan & Lanjut Anak Berikutnya"
          : "Simpan & Selesai"}
      </Button>
    </form>
  );
}
