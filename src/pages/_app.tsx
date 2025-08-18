import "@/styles/globals.css";
import type { AppProps } from "next/app";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryProvider>
  );
}
