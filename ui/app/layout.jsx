import "@/styles/globals.css";
import AppBar from "@/components/appbar";
import Footer from "@/components/footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Literacy Platform | Suncorp",
  description:
    "Learn how to manage your money and achieve your financial goals with Suncorp's engaging and interactive financial literacy app. Whether you want to save, invest, budget, or start a social enterprise, we have the tools and resources to help you succeed. Join our community of learners and experts today and discover the money lessons for life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
