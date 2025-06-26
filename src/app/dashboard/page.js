"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const hasShown = useRef(false);

  useEffect(() => {
    if (success === "1" && !hasShown.current) {
      toast.success("Login berhasil, selamat datang!");
      hasShown.current = true;
    }
  }, [success]);

  return (
    <div>
      <h1 className="text-xl font-bold">Selamat datang di Dashboard</h1>
    </div>
  );
}
