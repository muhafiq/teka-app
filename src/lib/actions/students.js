"use server";

import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { uploadToCloudinary } from "@/lib/cloudinary";

const updateStudentSchema = z.object({
  studentId: z.string().uuid(),
  name: z.string().min(1),
  gender: z.enum(["L", "P"]),
  religion: z.string().min(1),
  address: z.string().min(1),
  birthPlace: z.string().min(1),
  birthDate: z.string(), // format yyyy-mm-dd
  nation: z.string().min(1),
  uniformSize: z.enum(["S", "M", "L", "XL"]),
  spesificDesease: z.string().optional(),
  disabled: z.string().optional(),
});

export async function updateStudent(prevState, formData) {
  try {
    const parsed = updateStudentSchema.safeParse({
      studentId: formData.get("studentId"),
      name: formData.get("name"),
      gender: formData.get("gender"),
      religion: formData.get("religion"),
      address: formData.get("address"),
      birthPlace: formData.get("birthPlace"),
      birthDate: formData.get("birthDate"),
      nation: formData.get("nation"),
      uniformSize: formData.get("uniformSize"),
      spesificDesease: formData.get("spesificDesease") || "",
      disabled: formData.get("disabled") ? "1.0" : "0.0",
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Data tidak valid",
      };
    }

    const kartuKeluarga = formData.get("kartuKeluarga");
    const aktaKelahiran = formData.get("aktaKelahiran");

    const kk_url = await uploadToCloudinary(kartuKeluarga);
    const akta_url = await uploadToCloudinary(aktaKelahiran);

    const { studentId, ...data } = parsed.data;

    await db
      .update(students)
      .set({
        ...data,
        kartuKeluarga: kk_url,
        aktaKelahiran: akta_url,
      })
      .where(eq(students.id, studentId));

    return {
      success: true,
      message: "Data siswa berhasil diperbarui",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui data",
    };
  }
}
