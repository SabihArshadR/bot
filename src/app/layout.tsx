import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Gluten,
  Karla,
  Roboto,
} from "next/font/google";
import "./globals.css";
import * as React from "react";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import ClientProvider from "./ClientProvider";
import Providers from "./providers";
import { UserProvider } from "@/context/UserContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AudioProvider } from "@/context/AudioContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const gluten = Gluten({
  variable: "--font-gluten",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOT Despertat pel silenci",
  description:
    "Bot, 1937. La Dansada ha emmudit i el Gegant de les muntanyes de Bot necessita la vostra ajuda. Seguiu el mapa, recolliu aliments amb realitat augmentada, responeu preguntes i feu tornar la música als carrers del poble. Una experiència familiar per descobrir Bot d’una manera diferent.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

// Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${gluten.variable} ${karla.variable} ${roboto.variable} antialiased`}
      >
        <Providers>
          <UserProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AudioProvider>
                <ClientProvider>{children}</ClientProvider>
              </AudioProvider>
            </NextIntlClientProvider>
          </UserProvider>
        </Providers>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
