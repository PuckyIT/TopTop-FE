"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { AbilityProvider } from "./context/AbilityContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { usePathname } from "next/navigation";
import HeaderComponent from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = "user";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Lấy đường dẫn hiện tại
  const currentPath = usePathname();

  // Kiểm tra xem có cần ẩn Header và Sidebar hay không
  const hideHeaderFooter =
    currentPath && ["/login", "/signup"].includes(currentPath);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <html lang="en">
          <head>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
              }}
            />
          </head>
          <AbilityProvider role={userRole}>
            <body className={inter.className}>
              {/* Cấu trúc chính của layout */}
              <div className="flex min-h-screen w-full">
                {/* Header */}
                {!hideHeaderFooter && <HeaderComponent />}

                {/* Sidebar và Nội dung chính */}
                <div className="flex flex-1 h-full w-full">
                  {!hideHeaderFooter && <Sidebar />}
                  <div className="flex-1 h-full">{children}</div>
                </div>
              </div>
            </body>
          </AbilityProvider>
        </html>
      </ThemeProvider>
    </Provider>
  );
}
