"use server";

import { db } from "../db";
import { attendance } from "../db/schema";

export async function presensiSiswa(prevState, formData) {
  try {
    const studentIds = formData.getAll("attendance");

    const rowsToInsert = studentIds.map((id) => ({
      studentId: id,
      date: new Date(),
    }));

    await db.insert(attendance).values(rowsToInsert);

    return { success: true, message: "Presensi berhasil disimpan." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan." };
  }
}
