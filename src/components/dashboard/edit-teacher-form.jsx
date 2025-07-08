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

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateTeacher } from "@/lib/actions/teachers";
import { gender, religion } from "@/helpers/schema";

export default function EditTeacherForm({ teacherData }) {
  const [state, formAction, isPending] = useActionState(updateTeacher, {
    success: false,
    message: "",
    errors: {},
  });

  const [genderVal, setGenderVal] = useState(teacherData.gender ?? "");
  const [religionVal, setReligionVal] = useState(teacherData.religion ?? "");
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
          <CardTitle className="text-2xl">Edit Data Guru</CardTitle>
          <CardDescription>Isi informasi lengkap guru.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Hidden */}
            <input type="hidden" name="userId" value={teacherData.userId} />

            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={teacherData.name}
              />
              {state.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            {/* No HP */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">No. HP</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                required
                defaultValue={teacherData.phoneNumber}
              />
              {state.errors?.phoneNumber && (
                <p className="text-sm text-red-500">
                  {state.errors.phoneNumber[0]}
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
                defaultValue={teacherData.nip}
              />
              {state.errors?.nip && (
                <p className="text-sm text-red-500">{state.errors.nip[0]}</p>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                name="gender"
                required
                value={genderVal}
                onChangeValue={(val) => setGenderVal(val)}
              >
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
              <Select
                name="religion"
                required
                value={religionVal}
                onChangeValue={(val) => setReligionVal(val)}
              >
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
              <Input
                id="address"
                name="address"
                required
                defaultValue={teacherData.address}
              />
              {state.errors?.address && (
                <p className="text-sm text-red-500">
                  {state.errors.address[0]}
                </p>
              )}
            </div>

            {/* Tanggal Bergabung */}
            <div className="grid gap-2">
              <Label htmlFor="joinedDate">Tanggal Bergabung</Label>
              <Input
                id="joinedDate"
                name="joinedDate"
                type="date"
                required
                defaultValue={teacherData.joinedDate.toISOString().slice(0, 10)}
              />
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
                {isPending ? "Menyimpan..." : "Simpan Data Guru"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
