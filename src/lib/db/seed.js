import { role } from "@/helpers/schema";
import { db } from ".";
import { users } from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  await db.insert(users).values({
    name: "Admin",
    password: bcrypt.hashSync("rahasiabanget", 10),
    phoneNumber: "082313074450",
    role: role.admin,
  });
  console.log("Seeding admin success!");
}
