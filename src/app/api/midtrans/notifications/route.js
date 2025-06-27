import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { finances, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { snap } from "@/lib/midtrans";
import { financeTypes } from "@/helpers/schema";

// 👇 Hanya menerima POST
export async function POST(req) {
  try {
    const body = await req.json();

    const response = NextResponse.json({ message: "ok" });

    setTimeout(async () => {
      try {
        const { transaction_status, order_id, settlement_time, gross_amount } =
          body;

        let newStatus = "unpaid";
        let paidAt = null;

        // Tangani status
        if (
          transaction_status === "settlement" ||
          transaction_status === "capture"
        ) {
          newStatus = "paid";
          paidAt = new Date(settlement_time);
        } else if (transaction_status === "pending") {
          newStatus = "unpaid";
        } else if (
          transaction_status === "expire" ||
          transaction_status === "cancel"
        ) {
          newStatus = "unpaid";
        }

        await db
          .update(invoices)
          .set({ status: newStatus, paid_at: paidAt })
          .where(eq(invoices.id, order_id));

        if (
          transaction_status === "settlement" ||
          transaction_status === "capture"
        ) {
          await db.insert(finances).values({
            amount: gross_amount,
            category: "spp",
            date: paidAt || new Date(),
            type: financeTypes.income,
            invoiceId: order_id,
            description: "Pembayaran spp oleh orang tua siswa",
          });
        }
      } catch (error) {
        console.error("Background task error:", error);
      }
    }, 0);

    return response;
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
