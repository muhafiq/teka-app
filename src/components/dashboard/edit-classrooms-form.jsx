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
import { editClassroom } from "@/lib/actions/classrooms";
import { classroomTypes } from "@/helpers/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditClassroomForm({ waliKelasList, classroom }) {
  const [state, formAction, isPending] = useActionState(editClassroom, {
    success: false,
    message: "",
  });
  const [classType, setClassType] = useState(classroom.type ?? "");
  const [waliKelasId, setWaliKelasId] = useState(classroom.waliKelasId ?? "");

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
          <CardTitle className="text-2xl">Edit Data Kelas</CardTitle>
          <CardDescription>Isi detail baru kelas.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            <Input
              id="currentWaliKelas"
              type="hidden"
              name="currentWaliKelas"
              defaultValue={classroom.waliKelasId}
            />
            <Input
              id="id"
              type="hidden"
              name="id"
              defaultValue={classroom.id}
            />
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                name="location"
                id="location"
                placeholder="Contoh: Lantai 2"
                required
                defaultValue={classroom.location}
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
                value={classType}
                onValueChange={(val) => setClassType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={classroomTypes.class}>Kelas</SelectItem>
                  <SelectItem value={classroomTypes.lab}>Lab</SelectItem>
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
                defaultValue={classroom.capacity}
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
                required={classType != classroomTypes.lab}
                disabled={classType === classroomTypes.lab}
                onValueChange={(val) => setWaliKelasId(val)}
                defaultValue={waliKelasId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih wali kelas" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...waliKelasList,
                    {
                      waliKelasId: classroom.waliKelasId,
                      name: classroom.waliKelasName,
                    },
                  ].map((wali) => (
                    <SelectItem key={wali.waliKelasId} value={wali.waliKelasId}>
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
