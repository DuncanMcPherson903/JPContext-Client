import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AuthProvider } from '../contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JPContext",
  description: "A vocabulary context reference database for use by Japanese language learners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Theme appearance="light" accentColor="blue" radius="medium">
          <AuthProvider>
            {children}
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
