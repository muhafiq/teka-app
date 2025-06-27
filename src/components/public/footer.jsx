export default function Footer() {
  return (
    <footer className="border-t bg-white py-6 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-2">
        <p>&copy; 2025 TK Tadika Mesra. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="mailto:info@tadikamesra.sch.id"
            className="hover:text-primary"
          >
            info@tadikamesra.sch.id
          </a>
          <a href="https://wa.me/6281234567890" className="hover:text-primary">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
