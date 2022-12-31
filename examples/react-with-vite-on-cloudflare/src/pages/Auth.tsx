import { useRouter, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { authenticatedRoute } from "../Router";
import { trpc } from "../trpcUtil";

export const Auth = (): JSX.Element => {
  const { navigate } = useRouter();

  const search = useSearch();
  const { mutate } = trpc.auth.login.useMutation();

  useEffect(() => {
    /**
     * @todo error handling if code is not present
     */
    if (search.code == null) {
      return;
    }
    mutate({
      oauthToken: search.code,
    });

    navigate({ to: authenticatedRoute.id });
  }, [mutate, search, navigate]);
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">processing...</h1>
    </div>
  );
};
