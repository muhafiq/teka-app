"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActionState, useEffect } from "react";
import { presensiSiswa } from "@/lib/actions/presensi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PresensiStudentsForm({ studentsData }) {
  const [state, formAction, isPending] = useActionState(presensiSiswa, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/presensi/students");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Card className="p-8 shadow-sm">
        <CardTitle className="text-xl font-semibold">
          Halaman Presensi Murid
        </CardTitle>
        <CardDescription>
          Halaman ini digunakan untuk presensi siswa. Centang atau tidak untuk
          presensi.
        </CardDescription>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Presensi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsData.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.gender == "L" ? "Laki-laki" : "Perempuan"}
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    name="attendance"
                    value={student.id}
                    className="h-5 w-5 rounded-md border-gray-300 text-primary-600"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!state.success && (
          <p className="text-sm text-red-500 mt-2">{state.message}</p>
        )}
        <div className="pt-4 self-center">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Submit Presensi"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
