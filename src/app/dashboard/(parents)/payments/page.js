import { auth } from "@/auth";
import { db } from "@/lib/db";
import { invoices, students, parents } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayNowButton } from "@/components/finances/pay-midtrans";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function Payments() {
  const { user } = await auth();

  if (!user) return notFound();

  // Get parent based on current user
  const parent = await db.query.parents.findFirst({
    where: eq(parents.userId, user.id),
  });

  if (!parent) return <p>Data orang tua tidak ditemukan.</p>;

  // Get students
  const student = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parent.id));

  const studentIds = student.map((s) => s.id);

  if (studentIds.length === 0) {
    return <p>Belum ada anak terdaftar.</p>;
  }

  // Get invoices
  const allInvoices = await db
    .select()
    .from(invoices)
    .where(inArray(invoices.studentId, studentIds));

  const unpaid = allInvoices.filter((inv) => inv.status === "unpaid");
  const paid = allInvoices.filter((inv) => inv.status === "paid");

  return (
    <Card className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Tagihan Anak</h1>

      <Tabs defaultValue="unpaid">
        <TabsList>
          <TabsTrigger value="unpaid">Belum Dibayar</TabsTrigger>
          <TabsTrigger value="paid">Sudah Dibayar</TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid">
          <InvoiceTable
            data={unpaid}
            siswa={student}
            parentInfo={user}
            showPayButton
          />
        </TabsContent>

        <TabsContent value="paid">
          <InvoiceTable data={paid} siswa={student} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function InvoiceTable({ data, siswa, showPayButton = false, parentInfo }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Anak</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            {showPayButton ? (
              <TableHead>Aksi</TableHead>
            ) : (
              <TableHead>Dibayar Pada</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((inv) => {
            const student = siswa.find((s) => s.id === inv.studentId);
            return (
              <TableRow key={inv.id}>
                <TableCell>{student?.name}</TableCell>
                <TableCell className="capitalize">{inv.category}</TableCell>
                <TableCell>Rp {inv.amount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  {new Date(inv.due_date * 1000).toLocaleDateString("id-ID")}
                </TableCell>
                {showPayButton ? (
                  <TableCell>
                    <PayNowButton
                      amount={inv.amount}
                      name={parentInfo.name}
                      phone={parentInfo.phoneNumber}
                      orderId={inv.id}
                    />
                  </TableCell>
                ) : (
                  <TableCell>
                    {inv.paid_at
                      ? new Date(inv.paid_at * 1000).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {data.length === 0 && (
        <p className="text-muted-foreground mt-4">Tidak ada data.</p>
      )}
    </div>
  );
}
