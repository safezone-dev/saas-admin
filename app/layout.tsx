import "./globals.css";

export const metadata = {
  title: "SaaS Admin",
  description: "Sistema Modular",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}