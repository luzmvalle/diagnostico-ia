import './globals.css';

export const metadata = {
  title: 'DiagnÃ³stico IA â Descubra como a IA pode transformar seu dia a dia',
  description:
    'Ferramenta gratuita que analisa seu perfil profissional e recomenda os melhores casos de uso de IA para sua realidade.',
  openGraph: {
    title: 'DiagnÃ³stico IA â por Destrava Lab',
    description:
      'Descubra como a IA pode transformar seu dia a dia profissional. DiagnÃ³stico gratuito e personalizado.',
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
