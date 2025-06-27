import { db } from ".";
import {
  users,
  teachers,
  classrooms,
  finances,
  invoices,
  students,
  parents,
} from "./schema";
import bcrypt from "bcryptjs";
import {
  role,
  gender,
  religion,
  classroomTypes,
  dateToString,
  financeTypes,
} from "@/helpers/schema";
import { faker } from "@faker-js/faker";

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

// Helper untuk tanggal hari ini & sebelumnya
function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export async function seedFinances() {
  await db.insert(finances).values([
    {
      type: financeTypes.income,
      category: "SPP",
      amount: 500_000,
      date: daysAgo(10),
      description: "Pembayaran SPP bulan Juni",
    },
    {
      type: financeTypes.expense,
      category: "Gaji",
      amount: 2_000_000,
      date: daysAgo(9),
      description: "Pembayaran gaji guru",
    },
    {
      type: financeTypes.expense,
      category: "Rekreasi",
      amount: 750_000,
      date: daysAgo(7),
      description: "Biaya kegiatan rekreasi siswa",
    },
    {
      type: financeTypes.income,
      category: "Donasi",
      amount: 1_000_000,
      date: daysAgo(5),
      description: "Donasi dari alumni",
    },
    {
      type: financeTypes.expense,
      category: "Operasional",
      amount: 300_000,
      date: daysAgo(3),
      description: "Pembelian alat kebersihan",
    },
  ]);

  console.log("✅ Finansial seeded!");
}

export async function seedInvoices() {
  // Ambil semua student
  const allStudents = await db.select().from(students);

  if (allStudents.length === 0) {
    console.log("Tidak ada student ditemukan. Seed student dulu.");
    return;
  }

  // Bikin 3 invoice per student
  for (const student of allStudents) {
    for (let i = 0; i < 3; i++) {
      const isPaid = false;
      const dueDate = faker.date.future();

      await db.insert(invoices).values({
        studentId: student.id,
        amount: 200000,
        due_date: dueDate,
        status: isPaid ? "paid" : "unpaid",
        paid_at: null,
        category: "spp",
      });
    }
  }

  console.log(`✅ Seeded invoices untuk ${allStudents.length} siswa.`);
}

export async function seedStudents(jumlah = 10) {
  const [parent] = await db.select().from(parents).limit(1);
  const [classroom] = await db.select().from(classrooms).limit(1);

  if (!parent || !classroom) {
    console.log("Parent atau Classroom belum ada. Seed dulu.");
    return;
  }

  const newStudents = Array.from({ length: jumlah }).map(() => {
    const gender = faker.helpers.arrayElement(["L", "P"]);
    return {
      name: faker.person.fullName({ sex: gender === "L" ? "male" : "female" }),
      gender,
      religion: faker.helpers.arrayElement([
        "Islam",
        "Kristen",
        "Katolik",
        "Hindu/Budha",
        "Konghucu",
      ]),
      address: faker.location.streetAddress(),
      kartuKeluarga: faker.image.urlLoremFlickr({ category: "document" }),
      aktaKelahiran: faker.image.urlLoremFlickr({ category: "birth" }),
      spesificDesease: Math.random() > 0.8 ? faker.lorem.words(2) : null,
      birthDate: faker.date
        .birthdate({ min: 5, max: 6, mode: "age" })
        .toISOString()
        .split("T")[0],
      birthPlace: faker.location.city(),
      nation: "Indonesia",
      parentId: parent.id,
      classroomId: classroom.id,
      disabled: faker.datatype.boolean() ? "1" : "0",
    };
  });

  await db.insert(students).values(newStudents);
  console.log(`✅ Berhasil seeding ${jumlah} student.`);
}
