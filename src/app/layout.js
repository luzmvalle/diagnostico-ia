import './globals.css';

export const metadata = {
  title: 'Diagnóstico IA — Descubra como a IA pode transformar seu dia a dia',
  description:
    'Ferramenta gratuita que analisa seu perfil profissional e recomenda os melhores casos de uso de IA para sua realidade.',
  openGraph: {
    title: 'Diagnóstico IA — por Destrava Lab',
    description:
      'Descubra como a IA pode transformar seu dia a dia profissional. Diagnóstico gratuito e personalizado.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
