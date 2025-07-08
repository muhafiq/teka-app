"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // gunakan komponen button dari shadcn atau tailwind

export default function FinancesChart({ data }) {
  const [filter, setFilter] = useState("all");

  // Fungsi menyaring data berdasarkan filter aktif
  const getFilteredData = () => {
    const now = new Date();

    return data.filter((item) => {
      const date = new Date(item.date); // milidetik

      if (filter === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Senin
        startOfWeek.setHours(0, 0, 0, 0);
        return date >= startOfWeek && date <= now;
      }

      if (filter === "month") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "year") {
        return date.getFullYear() === now.getFullYear();
      }

      return true; // All time
    });
  };

  // Kelompokkan dan format data untuk chart
  const grouped = getFilteredData().reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
    acc[date][item.type] += item.amount;
    return acc;
  }, {});

  const chartData = Object.values(grouped);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Grafik Keuangan</h2>

      {/* Filter Tombol */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "today", "week", "month", "year"].map((f) => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? "default" : "outline"}
          >
            {{
              all: "Semua",
              today: "Hari Ini",
              week: "Minggu Ini",
              month: "Bulan Ini",
              year: "Tahun Ini",
            }[f]}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ transform: "translateY(30px)" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4caf50"
            name="Pemasukan"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#f44336"
            name="Pengeluaran"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}