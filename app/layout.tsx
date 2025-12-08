import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Partner Home - ABC Manufacturer",
  description: "Supplier portal for managing incident photos and product quality",
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

