import { Roboto_Mono } from "next/font/google";
import "../styles/forms.css";
import AuthWrapper from "../components/AuthWrapper.js";
import Navbar from "../components/Navbar.jsx";
import ModalRoot from "../components/ModalRoot.jsx";

const roboto = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "CarbonCalc - Track Your Footprint",
  description:
    "A simple application for tracking and offsetting your carbon footprint.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        <AuthWrapper>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthWrapper>
        <ModalRoot />
      </body>
    </html>
  );
}
