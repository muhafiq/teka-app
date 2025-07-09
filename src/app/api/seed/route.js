import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { seedInvoices, seedStudents } from "@/lib/db/seed";
export async function GET() {
  try {
    function getRandomSize() {
      const sizes = ["S", "M", "L", "XL"];
      const randomIndex = Math.floor(Math.random() * sizes.length);
      return sizes[randomIndex];
    }

    await db.update(students).set({ uniformSize: getRandomSize() });
    return Response.json({ message: "Success seeding!" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error while seeding!" });
  }
}
