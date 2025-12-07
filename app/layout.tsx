import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Incident Photo Hub - PartnerHome",
  description: "Enterprise SaaS dashboard for managing supplier incident photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <NavigationBar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

