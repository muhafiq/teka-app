import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
