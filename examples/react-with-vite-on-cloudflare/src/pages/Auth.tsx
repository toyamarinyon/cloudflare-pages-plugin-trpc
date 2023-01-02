import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter, useSearchParam } from "../router";
import { trpc } from "../trpcUtil";

export const Auth = (): JSX.Element => {
  const { router } = useRouter();

  const searchParam = useSearchParam(z.object({ code: z.string() }));
  const { mutate } = trpc.auth.login.useMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!searchParam.success) {
      return;
    }
    mutate({
      oauthToken: searchParam.data.code,
    });

    queryClient
      .invalidateQueries(trpc.tasks.list.getQueryKey())
      .then(() => router.push("/"));
  }, [mutate, router, searchParam, queryClient]);

  return <></>;
};
