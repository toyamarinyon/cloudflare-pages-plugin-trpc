import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hello } from "./Hello";
import { trpc } from "./trpc";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: import.meta.env.CF_PAGES_URL
        ? `${import.meta.env.CF_PAGES_URL}/api/trpc`
        : "http://localhost:8788/api/trpc",
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hello />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
