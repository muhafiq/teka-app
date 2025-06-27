import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ToastHandler } from "@/components/toast-handler";
import { Suspense } from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <ToastHandler message="Berhasil mendaftarkan anak anda, Silahkan lanjut login!" />
      </Suspense>

      <div className="w-full max-w-md space-y-6">
        {/* Info Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
            <CardDescription>
              Silakan masuk untuk mengakses dashboard aplikasi.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Form Login */}
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
