import RegisterStudentForm from "@/components/auth/register-student-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ToastHandler } from "@/components/toast-handler";
import { Suspense } from "react";

export default function RegisterStudent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ToastHandler message="Berhasil mendaftarkan anak anda!" />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daftarkan Anak</CardTitle>
          <CardDescription>
            Silakan isi formulir berikut untuk mendaftarkan anak Anda ke dalam
            sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterStudentForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
