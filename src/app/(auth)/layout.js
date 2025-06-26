import { Separator } from "@/components/ui/separator";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">PPDB App</h1>
          <p className="text-sm text-muted-foreground">Selamat datang 👋</p>
        </div>
        <Separator />
      </header>

      {/* Main content */}
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t">
        <Separator />
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PPDB App</p>
          <a
            href="/bantuan"
            className="hover:underline text-primary font-medium"
          >
            Butuh Bantuan?
          </a>
        </div>
      </footer>
    </div>
  );
}
