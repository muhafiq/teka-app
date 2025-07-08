"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTeacher } from "@/lib/actions/teachers";
import { gender, religion } from "@/helpers/schema";

export default function CreateTeacherForm() {
  const [state, formAction, isPending] = useActionState(createTeacher, {
    success: false,
    message: "",
    errors: {},
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/teachers");
    }
  }, [state]);

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tambah Guru Baru</CardTitle>
          <CardDescription>Isi informasi lengkap guru baru.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" required />
              {state.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            {/* No HP */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">No. HP</Label>
              <Input id="phoneNumber" name="phoneNumber" required />
              {state.errors?.phoneNumber && (
                <p className="text-sm text-red-500">
                  {state.errors.phoneNumber[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && (
                <p className="text-sm text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* NIP */}
            <div className="grid gap-2">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                name="nip"
                required
                minLength="18"
                maxLength="18"
              />
              {state.errors?.nip && (
                <p className="text-sm text-red-500">{state.errors.nip[0]}</p>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={gender.L}>Laki-laki</SelectItem>
                  <SelectItem value={gender.P}>Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.gender && (
                <p className="text-sm text-red-500">{state.errors.gender[0]}</p>
              )}
            </div>

            {/* Agama */}
            <div className="grid gap-2">
              <Label htmlFor="religion">Agama</Label>
              <Select name="religion" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={religion.islam}>Islam</SelectItem>
                  <SelectItem value={religion.kristen}>Kristen</SelectItem>
                  <SelectItem value={religion.katolik}>Katolik</SelectItem>
                  <SelectItem value={religion.hinduBudha}>
                    Hindu/Budha
                  </SelectItem>
                  <SelectItem value={religion.konghucu}>Konghucu</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.religion && (
                <p className="text-sm text-red-500">
                  {state.errors.religion[0]}
                </p>
              )}
            </div>

            {/* Alamat */}
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" name="address" required />
              {state.errors?.address && (
                <p className="text-sm text-red-500">
                  {state.errors.address[0]}
                </p>
              )}
            </div>

            {/* Tanggal Bergabung */}
            <div className="grid gap-2">
              <Label htmlFor="joinedDate">Tanggal Bergabung</Label>
              <Input id="joinedDate" name="joinedDate" type="date" required />
              {state.errors?.joinedDate && (
                <p className="text-sm text-red-500">
                  {state.errors.joinedDate[0]}
                </p>
              )}
            </div>

            {/* Error Umum */}
            {!state.success && state.message && (
              <p className="text-sm text-red-500">{state.message}</p>
            )}

            {/* Tombol Submit */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Guru"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
