import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import { ScrollToTop } from "./components/interactions";
export const metadata = {
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  title: "US GLOBAL IMPEX | Engineering & Turnkey Solutions",
  description:
    "Canada-headquartered engineering consultancy delivering engineering, procurement, construction management and process safety solutions for a better tomorrow.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><ScrollToTop />{children}</body>
    </html>
  );
}
