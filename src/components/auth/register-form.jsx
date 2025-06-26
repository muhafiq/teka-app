"use client";

import { useActionState } from "react";
import { registerParent } from "@/lib/actions/auth";
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
import { useSearchParams } from "next/navigation";
import { religion } from "@/helpers/schema";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [errorMessage, formAction, isPending] = useActionState(
    registerParent,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Nama orang tua/wali"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Nomor Telepon</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          required
          type="tel"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" required type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            required
            type="password"
          />
        </div>
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
              {religion.map}
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
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          name="address"
          required
          placeholder="Alamat lengkap orang tua"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job">Pekerjaan</Label>
          <Input id="job" name="job" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="income">Penghasilan per bulan (Rp)</Label>
          <Input id="income" name="income" required type="number" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isWali"
          name="isWali"
          className="rounded border-gray-300"
        />
        <Label htmlFor="isWali" className="text-sm text-gray-700">
          Orang tua adalah wali
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalStudents">Jumlah Anak yang Didaftarkan</Label>
        <Input
          id="totalStudents"
          name="totalStudents"
          required
          type="number"
          min={1}
        />
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mendaftar..." : "Lanjut ke Form Anak"}
      </Button>
    </form>
  );
}
