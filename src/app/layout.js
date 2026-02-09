import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Navbar, Footer, AuthWrapper } from '@/components';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Carbon Cut",
  description:
    "A simple application for tracking and offsetting your carbon footprint.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthWrapper>
          <Navbar />
          <main className="main-content">{children}</main>
          <Footer />
        </AuthWrapper>
        <ModalRoot />
      </body>
    </html>
  );
}
