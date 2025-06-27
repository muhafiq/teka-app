import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="border-b py-4 px-6 md:px-10 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 select-none">
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">TK Tadika Mesra</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Tentang Kami
          </Link>
          <Link href="/" className="hover:text-primary transition-colors">
            Kegiatan
          </Link>
          <Link href="/" className="hover:text-primary transition-colors">
            Kontak
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            <Button className="cursor-pointer">Login</Button>
          </Link>
          <Link
            href="/register"
            className="hover:text-primary transition-colors"
          >
            <Button className="cursor-pointer">Daftar</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
