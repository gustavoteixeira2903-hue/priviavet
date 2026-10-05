import './globals.css';

export const metadata = {
  title: 'PriviaVet',
  description: 'Prontuário Inteligente e Blindagem Jurídica para Veterinários',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
