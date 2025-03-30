"use client"; // Add this to make it a Client Component
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import Link from "next/link";

/**
 * Root layout component wrapping the app with ApolloProvider and navigation.
 * @param children - The child components to render.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    // Simulated logout; replace with backend logout mutation if available
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <ApolloProvider client={client}>
          <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 items-center justify-between md:flex-row md:py-5 lg:px-8">
              <Link
                href="/dashboard"
                className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl"
              >
                Task Manager
              </Link>
              <div className="flex flex-col gap-2 items-center md:flex-row md:gap-4">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 md:w-auto md:px-4 md:py-2 md:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="flex-grow pt-16 pb-8 md:pt-20 md:pb-10">
            {children}
          </main>
          <footer className="bg-white shadow-inner">
            <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs md:py-5 md:text-sm lg:px-8 text-gray-600">
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </div>
          </footer>
        </ApolloProvider>
      </body>
    </html>
  );
}
