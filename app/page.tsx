import type { Metadata } from "next";
import { HEADER_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: HEADER_CONFIG.default.title,
  description: HEADER_CONFIG.default.description,
};

export default function Home() {
  return <h1>Hello World!</h1>
}
