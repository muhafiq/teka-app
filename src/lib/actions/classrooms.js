"use server";

import { redirect } from "next/navigation";
import { db } from "../db";
import { classrooms, students } from "../db/schema";
import { z } from "zod";
import { classroomTypes } from "@/helpers/schema";
import { eq } from "drizzle-orm";

const classroomSchema = z.object({
  id: z.string().nullable().optional(),
  capacity: z.number().max(50),
  location: z.string().min(3),
  type: z.enum([classroomTypes.class, classroomTypes.lab]),
  waliKelas: z.string().min(30).nullable().optional(),
  currentWaliKelas: z.string().nullable().optional(),
});

export async function createClassroom(prevState, formData) {
  try {
    const validated = classroomSchema.safeParse({
      capacity: +formData.get("capacity"),
      location: formData.get("location"),
      type: formData.get("type"),
      waliKelas: formData.get("waliKelas"),
    });

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "Pastikan mengisi data dengan benar.",
      };
    }

    const [classroom] = await db
      .insert(classrooms)
      .values({
        capacity: validated.data.capacity,
        location: validated.data.location,
        type: validated.data.type,
        waliKelas: validated.data.waliKelas,
      })
      .returning({ id: classrooms.id });

    if (!classroom.id) {
      return {
        success: false,
        message: "Gagal menambahkan kelas, mohon ulangi beberapa saat lagi!",
      };
    }
    return {
      success: true,
      message: "Berhasil menambahkan kelas baru.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Gagal menambahkan kelas, mohon ulangi beberapa saat lagi!",
    };
  }
}

export async function editClassroom(prevState, formData) {
  try {
    const validated = classroomSchema.safeParse({
      capacity: +formData.get("capacity"),
      location: formData.get("location"),
      type: formData.get("type"),
      waliKelas: formData.get("waliKelas"),
      currentWaliKelas: formData.get("currentWaliKelas"),
      id: formData.get("id"),
    });

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "Pastikan mengisi data dengan benar.",
      };
    }

    let classroom;
    if (validated.data.currentWaliKelas === validated.data.waliKelas) {
      classroom = await db
        .update(classrooms)
        .set({
          capacity: validated.data.capacity,
          location: validated.data.location,
          type: validated.data.type,
        })
        .where(eq(classrooms.id, validated.data.id))
        .returning({ id: classrooms.id });
    } else {
      classroom = await db
        .update(classrooms)
        .set({
          capacity: validated.data.capacity,
          location: validated.data.location,
          type: validated.data.type,
          waliKelas: validated.data.waliKelas,
        })
        .where(eq(classrooms.id, validated.data.id))
        .returning({ id: classrooms.id });
    }

    if (!classroom[0].id) {
      return {
        success: false,
        message: "Gagal mengedit kelas, mohon ulangi beberapa saat lagi!",
      };
    }

    return {
      success: true,
      message: "Berhasil mengubah data kelas.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Gagal mengedit kelas, mohon ulangi beberapa saat lagi!",
    };
  }
}

export async function deleteClassroom(prevState, formData) {
  try {
    const id = formData.get("classroomId");

    const validated = z.string().min(20).safeParse(id);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: "Classroom ID tidak valid!",
      };
    }

    const classroomId = validated.data;

    const classroom = await db.query.classrooms.findFirst({
      where: eq(classrooms.id, classroomId),
    });

    if (!classroom) {
      return { success: false, message: "Classroom tidak ditemukan!" };
    }

    const studentsInClass = await db
      .select()
      .from(students)
      .where(eq(students.classroomId, classroomId));

    if (studentsInClass.length > 0) {
      return {
        success: false,
        message: `Kelas tidak boleh dihapus jika ada siswanya!`,
      };
    }

    await db.delete(classrooms).where(eq(classrooms.id, classroomId));

    return {
      success: true,
      message: "Berhasil menghapus kelas.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Gagal menghapus kelas, mohon ulangi beberapa saat lagi!",
    };
  }
}
