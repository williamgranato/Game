import './globals.css'
import './globals_patch.css'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-zinc-100">{children}</body>
    </html>
  )
}
