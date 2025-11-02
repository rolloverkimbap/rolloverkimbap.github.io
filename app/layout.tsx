import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/app/components/navbar";
import LoginModal from "@/app/components/login-modal";
import SignupModal from "@/app/components/signup-modal";
import ProfileModal from "@/app/components/profile-modal";
import Footer from "@/app/components/footer";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Roll Over | New York Kimbap",
  description: "Authentic Korean Kimbap in Brooklyn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <LoginModal />
          <SignupModal />
          <ProfileModal />

          <main>{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
