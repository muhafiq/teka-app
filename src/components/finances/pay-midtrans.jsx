"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function PayNowButton({ amount, name, phone, orderId }) {
  useEffect(() => {
    // Load snap script
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    );
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClick = async () => {
    const res = await fetch("/api/midtrans/token", {
      method: "POST",
      body: JSON.stringify({ amount, name, phone, orderId }),
    });

    const { token } = await res.json();

    if (window.snap) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          window.location.href = `/dashboard/payments/success?order_id=${result.order_id}`;
        },
        onPending: (result) => {
          window.location.href = `/dashboard/payments/status?order_id=${result.order_id}`;
        },
        onError: (result) => {
          window.location.href = `/dashboard/payments/status?order_id${result.order_id}`;
        },
        onClose: () => {
          alert("Anda menutup pop-up tanpa menyelesaikan pembayaran.");
        },
      });
    }
  };

  return <Button onClick={handleClick}>Bayar</Button>;
}
