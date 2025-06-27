import RegisterForm from "@/components/auth/register-form";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-4xl w-full space-y-6">
        {/* Informasi Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Daftar Akun Orang Tua</CardTitle>
            <CardDescription>
              Silakan isi formulir di bawah untuk mendaftarkan akun orang tua di
              sistem TekaApp.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Formulir */}
        <Suspense fallback={<div>Loading...</div>}>
          <Card>
            <CardContent className="pt-6">
              <RegisterForm />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}
