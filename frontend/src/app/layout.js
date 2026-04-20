import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Your Notes — Tulis Semua Pikiranmu',
  description: 'Aplikasi catatan elegan dengan tema gelap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: { background:'#1e1e1e', color:'#f5f0eb', fontFamily:'Inter,sans-serif', fontSize:'13px', fontWeight:'500', borderRadius:'10px', border:'1px solid #2a2a2a' },
          success: { iconTheme: { primary:'#c9a84c', secondary:'#1e1e1e' } },
          error: { iconTheme: { primary:'#e63946', secondary:'#1e1e1e' } },
        }} />
      </body>
    </html>
  );
}
