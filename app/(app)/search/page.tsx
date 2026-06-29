import type { Metadata } from "next";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return <SearchClient />;
}
