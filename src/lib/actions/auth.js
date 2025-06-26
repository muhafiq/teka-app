"use server";

import bcryptjs from "bcryptjs";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "../db";
import { parents, users, students, classrooms } from "../db/schema";
import { role } from "@/helpers/schema";
import { redirect } from "next/navigation";
import { uploadToCloudinary } from "../cloudinary";
import { eq, count, desc } from "drizzle-orm";

export async function authenticate(prevState, formData) {
  try {
    const callbackUrl = formData.get("redirectTo") || "/dashboard";
    const data = Object.fromEntries(formData);

    await signIn("credentials", {
      ...data,
      redirectTo: `${callbackUrl}?success=1`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Nomor telepon atau password salah.";
        default:
          return "Terjadi kesalahan saat login.";
      }
    }
    throw error;
  }
}

export async function registerParent(prevState, formData) {
  const data = Object.fromEntries(formData);

  const user = await db
    .insert(users)
    .values({
      name: data.name,
      role: role.parent,
      phoneNumber: data.phoneNumber,
      password: await bcryptjs.hash(data.password, 10),
    })
    .returning({ id: users.id });

  const parent = await db
    .insert(parents)
    .values({
      isWali: data.isWali,
      income: data.income,
      job: data.job,
      religion: data.religion,
      address: data.address,
      gender: data.gender,
      userId: user[0].id,
    })
    .returning({ id: parents.id });

  const totalStudents = data.totalStudents || 1;
  return redirect(
    `/register/students?parentId=${parent[0].id}&step=1&total=${totalStudents}`
  );
}

export async function registerStudents(prevState, formData) {
  const data = Object.fromEntries(formData);
  const step = Number(data.step);
  const total = Number(data.total);

  const kartuKeluarga = formData.get("kartuKeluarga");
  const aktaKelahiran = formData.get("aktaKelahiran");

  const kk_url = await uploadToCloudinary(kartuKeluarga);
  const akta_url = await uploadToCloudinary(aktaKelahiran);

  const classroomId = await findAvailableClassroom();

  await db.insert(students).values({
    name: data.name,
    gender: data.gender,
    religion: data.religion,
    address: data.address,
    kartuKeluarga: kk_url,
    aktaKelahiran: akta_url,
    spesificDesease: data.spesificDesease || "",
    birthDate: data.birthDate,
    birthPlace: data.birthPlace,
    nation: data.nation,
    parentId: data.parentId,
    classroomId: classroomId,
    disabled: data.disabled === "on" ? 1 : 0,
  });

  if (step < total) {
    return redirect(
      `/register/students?parentId=${data.parentId}&step=${
        step + 1
      }&total=${total}`
    );
  } else {
    return redirect("/login?success=1");
  }
}

async function findAvailableClassroom() {
  const allClassrooms = await db
    .select()
    .from(classrooms)
    .orderBy(classrooms.createdAt);

  for (const classroom of allClassrooms) {
    const studentCount = await db
      .select({ count: count() })
      .from(students)
      .where(eq(students.classroomId, classroom.id));

    if (studentCount[0].count < classroom.capacity) {
      return classroom.id;
    }
  }

  throw new Error("Semua kelas sudah penuh.");
}
