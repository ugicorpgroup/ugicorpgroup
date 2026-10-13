import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import { ScrollToTop } from "./components/interactions";
export const metadata = {
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  title: "US Global Impex | USGI EPC | Engineering & Turnkey Solutions",
  description:
    "US Global Impex (USGI EPC) delivers engineering, procurement, construction management and process safety solutions for energy and industrial projects.",
  keywords: ["US Global Impex", "USGI EPC", "engineering consultancy", "engineering procurement and construction", "construction management", "process safety management", "oil and gas engineering", "turnkey solutions"],
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><ScrollToTop />{children}</body>
    </html>
  );
}
