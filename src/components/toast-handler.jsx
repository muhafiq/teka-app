"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export function ToastHandler({ message }) {
  const params = useSearchParams();
  const hasShown = useRef(false);

  useEffect(() => {
    const success = params.get("success");
    const error = params.get("error");

    if (!hasShown.current) {
      if (success === "1") {
        toast.success(message);
        hasShown.current = true;
      } else if (error) {
        toast.error(decodeURIComponent(error));
        hasShown.current = true;
      }
    }
  }, [params]);

  return null;
}
