"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { HEADER_CONFIG } from "@/lib/constants";

export function DynamicHeader() {
  const pathname = usePathname();
  
  const config = HEADER_CONFIG[pathname] || HEADER_CONFIG.default;
  
  return <Header title={config.title} description={config.description} />;
}
