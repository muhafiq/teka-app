import FinancesTable from "@/components/finances/finances-table";
import { db } from "@/lib/db";
import { finances } from "@/lib/db/schema";

export default async function FinancesPage() {
  const data = await db.select().from(finances).orderBy(finances.date);

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Keuangan Sekolah</h1>
      <FinancesTable data={data} />
    </div>
  );
}
