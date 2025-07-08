"use server";

import { db } from "../db";
import { invoices, students } from "../db/schema";
import { z } from "zod";

const customInvoiceSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  amount: z.coerce.number().gt(0, "Nominal harus lebih dari 0"),
  category: z.string().min(1, "Kategori wajib diisi"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Format tanggal tidak valid",
  }),
});

export async function createCustomInvoices(prevState, formData) {
  try {
    const parsed = customInvoiceSchema.safeParse({
      studentId: formData.get("studentId"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      dueDate: formData.get("dueDate"),
    });

    if (!parsed.success) {
      console.log({
        success: false,
        message: "Data tidak valid",
        errors: parsed.error.flatten().fieldErrors,
      });
      return {
        success: false,
        message: "Data tidak valid",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { studentId, amount, category, dueDate } = parsed.data;

    await db.insert(invoices).values({
      studentId,
      amount,
      category,
      due_date: new Date(dueDate),
      status: "unpaid",
    });

    return {
      success: true,
      message: "Tagihan berhasil dibuat",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat tagihan",
    };
  }
}

export async function createSppInvoices(prevState, formData) {
  try {
    const amount = 2_500_000;
    const category = "spp";
    const now = new Date();
    const plus30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const status = "unpaid";

    // 1. Ambil semua ID siswa
    const allStudents = await db.select({ id: students.id }).from(students);

    if (allStudents.length === 0) {
      return {
        success: false,
        message: "Tidak ada siswa ditemukan.",
      };
    }

    // 2. Siapkan data invoice
    const newInvoices = allStudents.map((s) => ({
      studentId: s.id,
      amount,
      due_date: plus30Days,
      status,
      category,
    }));

    // 3. Masukkan ke tabel invoices
    await db.insert(invoices).values(newInvoices);

    return {
      success: true,
      message: `Berhasil membuat ${newInvoices.length} invoice SPP.`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat invoice.",
    };
  }
}
