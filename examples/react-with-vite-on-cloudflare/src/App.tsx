import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Router } from "./Router";
import { links, trpc } from "./trpcUtil";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links,
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
