import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BaseProvider } from "@/shared/layouts/base/BaseProvider";
import BaseLayout from "@/shared/layouts/base/BaseLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "채팅 데모 어플리케이션",
  description: "채팅 데모 어플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <BaseProvider>{children}</BaseProvider>
    </BaseLayout>
  );
}
