import RegisterStudentForm from "@/components/auth/register-student-form";
import { Suspense } from "react";

export default function RegisterStudent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterStudentForm />
      </Suspense>
    </div>
  );
}
