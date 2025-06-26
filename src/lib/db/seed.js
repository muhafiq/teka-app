import { db } from ".";
import { users, teachers, classrooms } from "./schema";
import bcrypt from "bcryptjs";
import {
  role,
  gender,
  religion,
  classroomTypes,
  dateToString,
} from "@/helpers/schema";

export async function seed() {
  await db.insert(users).values({
    name: "Admin",
    password: bcrypt.hashSync("rahasiabanget", 10),
    phoneNumber: "082313074450",
    role: role.admin,
  });
  console.log("Seeding admin success!");
}

export async function seedClassroom() {
  const teacherNames = [
    "Siti Aminah",
    "Andi Wijaya",
    "Nurul Huda",
    "Rudi Hartono",
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const name = teacherNames[i];
    const phone = `0891235432${i + 1}`;
    const nip = `19801212202301156${i + 1}`;

    // 1. Insert user
    const hashedPassword = await bcrypt.hash("rahasiabanget", 10);
    const [user] = await db
      .insert(users)
      .values({
        name,
        role: role.teacher,
        phoneNumber: phone,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    // 2. Insert teacher
    const [teacher] = await db
      .insert(teachers)
      .values({
        nip,
        gender: i % 2 === 0 ? gender.L : gender.P,
        religion: religion.islam,
        address: `Jl. Pendidikan No.${i + 1}`,
        joinedDate: new Date(),
        userId: user.id,
      })
      .returning({ id: teachers.id });

    // 3. Insert classroom
    await db.insert(classrooms).values({
      capacity: 30,
      location: `Gedung A, Lt.${i + 1}`,
      type: classroomTypes.class,
      waliKelas: teacher.id,
    });
  }

  console.log("✅ Seeded 5 guru dan kelas.");
}
