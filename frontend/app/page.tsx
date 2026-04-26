"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import Chat from "@/components/Chat";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6 space-y-6">
      <div className="text-xl font-bold">
        {loading ? "Loading..." : `${products.length} products`}
      </div>

      <Chat />
    </main>
  );
}