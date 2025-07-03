"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react";
import { createClassroom } from "@/lib/actions/classrooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateClassroomForm({ waliKelasList }) {
  const [state, formAction, isPending] = useActionState(createClassroom, {
    success: false,
    message: "",
  });
  const [classType, setClassType] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/classrooms");
      toast.success(state.message);
    }
  }, [state]);

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Buat Kelas Baru</CardTitle>
          <CardDescription>Isi detail kelas baru.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                name="location"
                id="location"
                placeholder="Contoh: Lantai 2"
                required
              />
              {state?.errors?.location && (
                <p className="text-sm text-red-500 mt-2">
                  {state.errors.location[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Jenis Kelas</Label>
              <Select
                name="type"
                required
                onValueChange={(val) => setClassType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Kelas</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.type && (
                <p className="text-sm text-red-500 mt-2">
                  {state.errors.type[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                name="capacity"
                id="capacity"
                type="number"
                placeholder="Contoh: 30"
                min={1}
                required
              />
              {state?.errors?.capacity && (
                <p className="text-sm text-red-500 mt-2">
                  {state.errors.capacity[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="waliKelas">Wali Kelas</Label>
              <Select
                name="waliKelas"
                required={classType != "lab"}
                disabled={classType === "lab"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih wali kelas" />
                </SelectTrigger>
                <SelectContent>
                  {waliKelasList.map((wali) => (
                    <SelectItem key={wali.id} value={wali.id}>
                      {wali.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.waliKelas && (
                <p className="text-sm text-red-500 mt-2">
                  {state.errors.waliKelas[0]}
                </p>
              )}
            </div>

            {!state.success && (
              <p className="text-sm text-red-500 mt-2">{state.message}</p>
            )}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Kelas"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
