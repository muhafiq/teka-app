import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function FinancesTable({ data }) {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Riwayat Keuangan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead className="text-center">Tipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    Belum ada data keuangan.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description || "-"}</TableCell>
                    <TableCell>{formatRupiah(item.amount)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          item.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {item.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
