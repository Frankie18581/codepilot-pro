import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CodePilot Pro | 人性化 AI 编程助手",
  description: "具备拟人化交互意识的自动化研发助手",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
