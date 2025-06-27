import { Suspense } from "react";
import PaymentSuccess from "@/components/finances/payment-success";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
