import { snap } from "@/lib/midtrans";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const parameter = {
    transaction_details: {
      order_id: body.orderId,
      gross_amount: body.amount,
    },
    customer_details: {
      name: body.name,
      phone: body.phone,
    },
    enabled_payments: [
      "bank_transfer", // semua bank
      "qris",
      "gopay",
    ],
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}
