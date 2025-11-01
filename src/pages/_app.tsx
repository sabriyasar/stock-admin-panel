import "@/styles/globals.css";
import "@/styles/dashboard.scss";
import "@/styles/users.scss";
import '@/styles/login.scss'
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
