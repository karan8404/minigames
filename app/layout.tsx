import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import "./globals.css"
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";


export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
          <title>My App</title>
          <link rel="icon" href="/logo.png" />
        <body>
          <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <Navbar />
            {children}
          </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}