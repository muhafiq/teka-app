"use server";

import { gender, religion, role } from "@/helpers/schema";
import { z } from "zod";
import { users, teachers } from "@/lib/db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

const teacherSchema = z.object({
  id: z.string().min(20).nullable().optional(),
  nip: z.string().min(18).max(18),
  gender: z.enum([gender.L, gender.P]),
  religion:
    // prettier-ignore
    z.enum([
      religion.islam,
      religion.kristen,
      religion.katolik,
      religion.hinduBudha,
      religion.konghucu
    ]),
  address: z.string(),
  joinedDate: z.coerce.date(),
  userId: z.string().min(20).nullable().optional(),
});

const userSchema = z.object({
  id: z.string().min(20).nullable().optional(),
  name: z.string().max(100),
  role: z.enum([role.teacher]),
  phoneNumber: z.string(),
  password: z.string().min(8),
});

const userOnUpdate = z.object({
  id: z.string().min(20),
  name: z.string().max(100),
  phoneNumber: z.string(),
});

export async function createTeacher(prevState, formData) {
  try {
    const userValidated = userSchema.safeParse({
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      password: formData.get("password"),
      role: role.teacher,
    });

    if (!userValidated.success) {
      return {
        success: false,
        message: "Data akun tidak valid",
        errors: userValidated.error.flatten().fieldErrors,
      };
    }

    const [user] = await db
      .insert(users)
      .values(userValidated.data)
      .returning({ id: users.id });

    if (!user?.id) {
      return { success: false, message: "Gagal menyimpan akun pengguna" };
    }

    const teacherValidated = teacherSchema.safeParse({
      id: user.id,
      nip: formData.get("nip"),
      gender: formData.get("gender"),
      religion: formData.get("religion"),
      address: formData.get("address"),
      joinedDate: formData.get("joinedDate"),
      userId: user.id,
    });

    if (!teacherValidated.success) {
      return {
        success: false,
        message: "Data guru tidak valid",
        errors: teacherValidated.error.flatten().fieldErrors,
      };
    }

    await db.insert(teachers).values(teacherValidated.data);

    return {
      success: true,
      message: "Data guru berhasil ditambahkan",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan data guru",
    };
  }
}

export async function updateTeacher(prevState, formData) {
  try {
    const userId = formData.get("userId");

    if (!userId) {
      return {
        success: false,
        message: "ID pengguna tidak ditemukan",
      };
    }

    const userValidated = userOnUpdate.safeParse({
      id: userId,
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
    });

    if (!userValidated.success) {
      return {
        success: false,
        message: "Data guru tidak valid",
        errors: userValidated.error.flatten().fieldErrors,
      };
    }

    const data = userValidated.data;
    await db
      .update(users)
      .set({ name: data.name, phoneNumber: data.phoneNumber })
      .where(eq(users.id, userId));

    const teacherValidated = teacherSchema.safeParse({
      id: userId,
      nip: formData.get("nip"),
      gender: formData.get("gender"),
      religion: formData.get("religion"),
      address: formData.get("address"),
      joinedDate: formData.get("joinedDate"),
      userId: userId,
    });

    if (!teacherValidated.success) {
      return {
        success: false,
        message: "Data guru tidak valid",
        errors: teacherValidated.error.flatten().fieldErrors,
      };
    }

    delete teacherValidated.data.id;
    delete teacherValidated.data.userId;
    await db
      .update(teachers)
      .set(teacherValidated.data)
      .where(eq(teachers.userId, userId));

    return {
      success: true,
      message: "Data guru berhasil diperbarui",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui data guru",
    };
  }
}

export async function deleteTeacher(prevState, formData) {
  try {
    const id = formData.get("userId");

    const validated = z.string().min(20).safeParse(id);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "User ID tidak valid!",
      };
    }

    await db.delete(teachers).where(eq(teachers.userId, id));
    await db.delete(users).where(eq(users.id, id));

    return {
      success: true,
      message: "Berhasil menghapus data guru.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Gagal menghapus data guru, mohon ulangi beberapa saat lagi!",
    };
  }
}
