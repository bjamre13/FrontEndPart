
export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background py-6">
      <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground md:px-6">
        © {new Date().getFullYear()} CustomerSupportTicketManager. All rights reserved.
      </div>
    </footer>
  );
}
