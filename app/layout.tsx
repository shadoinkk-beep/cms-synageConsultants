"use client";

import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
            <ToastContainer autoClose={2000}  />
              {children}

      </body>
    </html>
  );
}
