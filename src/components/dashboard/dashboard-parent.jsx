import { auth } from "@/auth";
import { db } from "@/lib/db";
import { students, parents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notFound } from "next/navigation";

export default async function ParentDashboard() {
  const { user } = await auth();

  if (!user) return notFound();

  const parent = await db
    .select()
    .from(parents)
    .where(eq(parents.userId, user.id))
    .then((res) => res[0]);

  if (!parent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Akun belum terhubung ke data orang tua</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Silakan hubungi admin untuk menghubungkan akun ini ke data orang
              tua.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const children = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parent.id));

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Anak</CardTitle>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Anda belum memiliki data anak yang terdaftar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Tempat, Tanggal Lahir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell className="capitalize">{child.gender}</TableCell>
                    <TableCell>
                      {child.birthPlace},{" "}
                      {new Date(child.birthDate).toLocaleDateString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
