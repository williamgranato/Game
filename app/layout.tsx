import "./globals.css";
import { CharacterProvider } from "../context/CharacterContext";
import Header from "../components/Header";

export const metadata = {
  title: "Aldoria Guilds",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CharacterProvider>
          <Header />
          <main className="p-4">{children}</main>
        </CharacterProvider>
      </body>
    </html>
  );
}
