"use client";
import { createSppInvoices } from "@/lib/actions/invoices";
import { useActionState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateInvoiceSpp() {
  const [state, formAction, isPending] = useActionState(createSppInvoices, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/invoices");
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      {!state.success && (
        <p className="text-sm text-red-500 mt-2">{state.message}</p>
      )}
      <Button className="mt-4" type="submit">
        {isPending ? "Membuat Tagihan..." : "Buat Tagihan"}
      </Button>
    </form>
  );
}
