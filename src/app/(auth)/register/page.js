import RegisterForm from "@/components/auth/register-form";
import { Suspense } from "react";

export default function Register() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
