"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { useRef } from "react";

export default function Providers({ children }) {
  const clientRef = useRef(null);
  if (!clientRef.current) {
    clientRef.current = getQueryClient();
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
