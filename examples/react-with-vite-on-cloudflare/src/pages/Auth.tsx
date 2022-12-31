import { useRouter, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { trpc } from "../trpcUtil";

export const Auth = (): JSX.Element => {
  const { navigate } = useRouter();

  const search = useSearch();
  const { mutate } = trpc.auth.login.useMutation();

  const cb = useCallback(() => {
    mutate({
      oauthToken: search.code,
    });

    // navigate({ to: indexRoute.id, params: {}, search: "" });
  }, [mutate, search]);
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">processing...</h1>
      <button onClick={cb}>a</button>
    </div>
  );
};
