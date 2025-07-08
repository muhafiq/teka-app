import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Suspense } from "react";
import CreateInvoiceSpp from "@/components/dashboard/create-invoice-spp";
import CreateInvoiceCustom from "@/components/dashboard/create-invoices-custom";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";

export default async function InvoicesPage() {
  const allStudents = await db
    .select({ id: students.id, name: students.name })
    .from(students);

  return (
    <Card className="p-8 space-y-6">
      <CardTitle className="text-xl">Tagihan</CardTitle>

      <Accordion type="single" collapsible className="w-full">
        {/* Tagihan SPP */}
        <AccordionItem value="spp">
          <AccordionTrigger>Tagihan SPP</AccordionTrigger>
          <AccordionContent>
            <Card className="p-4">
              <CardTitle className="text-base">Tagihan SPP</CardTitle>
              <CardDescription>
                Hati-hati dalam menggunakan fitur ini, tombol akan langsung
                menagih semua siswa.
              </CardDescription>
              <CardContent className="p-0">
                <p>Tagihan bulan Juli: Rp2.500.000</p>
                <Suspense fallback={<div>Loading...</div>}>
                  <CreateInvoiceSpp />
                </Suspense>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Tagihan Custom */}
        <AccordionItem value="custom">
          <AccordionTrigger>Tagihan Lainnya</AccordionTrigger>
          <AccordionContent>
            <Card className="p-4">
              <CardTitle className="text-base mb-2">Lain-lain</CardTitle>
              <CardContent className="p-0">
                <Suspense fallback={<div>Loading...</div>}>
                  <CreateInvoiceCustom students={allStudents} />
                </Suspense>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
