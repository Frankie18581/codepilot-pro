import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CodePilot Pro | 企业级 AI 编程助手",
  description: "基于 LangGraph 和 PostgreSQL 的持久化 AI 助手",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
