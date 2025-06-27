"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${orderId}`);
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        console.error("Gagal mengambil invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Memuat informasi pembayaran...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-red-500 font-semibold">Pembayaran tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">Pastikan order ID benar</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-14 w-14 text-green-500" strokeWidth={1.5} />
          <CardTitle className="text-2xl font-bold text-center">
            Pembayaran Berhasil 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-muted-foreground">Order ID</span>
            <span>{invoice.id}</span>

            <span className="text-muted-foreground">Jumlah</span>
            <span>Rp{Number(invoice.amount).toLocaleString("id-ID")}</span>

            <span className="text-muted-foreground">Status</span>
            <span className="capitalize">{invoice.status}</span>

            <span className="text-muted-foreground">Tanggal Bayar</span>
            <span>
              {invoice.paid_at ? invoice.paid_at.toLocaleString("id-ID") : "-"}
            </span>
          </div>

          <div className="pt-4 flex justify-center">
            <Button onClick={() => router.push("/dashboard")}>
              Kembali ke Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
