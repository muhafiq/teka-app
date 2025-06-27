import RegisterStudentForm from "@/components/auth/register-student-form";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function RegisterStudent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header informasi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Pendaftaran Siswa</CardTitle>
            <CardDescription>
              Silakan isi data siswa untuk didaftarkan ke dalam sistem. Pastikan
              informasi yang dimasukkan benar.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Formulir pendaftaran siswa */}
        <Suspense fallback={<div>Loading...</div>}>
          <Card>
            <CardContent className="pt-6">
              <RegisterStudentForm />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}
