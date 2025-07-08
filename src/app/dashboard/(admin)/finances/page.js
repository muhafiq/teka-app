import FinancesTable from "@/components/finances/finances-table";
import FinancesChart from "@/components/finances/finances-chart";
import { db } from "@/lib/db";
import { finances } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FinancesPage() {
  const data = await db.select().from(finances).orderBy(finances.date);

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Data Keuangan Sekolah</h1>
        <Link href="/dashboard/invoices">
          <Button>+Buat Tagihan</Button>
        </Link>
      </div>
      <hr></hr>
      <br></br>

      <FinancesChart data={data} />

      <FinancesTable data={data} />
    </div>
  );
}
