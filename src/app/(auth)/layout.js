import Footer from "@/components/public/footer";
import Header from "@/components/public/header";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
