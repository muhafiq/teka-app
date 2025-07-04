import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import PageTransition from "@/components/page-transition";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata = {
  title: "Tadika Mesra | TK Berkualitas Internasional",
  description: "Tadika Mesra adalah TK dengan kualitas internasional",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PageTransition>{children}</PageTransition>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
