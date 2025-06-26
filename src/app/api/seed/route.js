import { seedClassroom } from "@/lib/db/seed";
export async function GET() {
  try {
    await seedClassroom();
    return Response.json({ message: "Success seeding!" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error while seeding!" });
  }
}
