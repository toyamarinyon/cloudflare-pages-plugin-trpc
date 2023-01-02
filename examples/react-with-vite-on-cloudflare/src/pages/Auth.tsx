import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useRouter, useSearchParam } from "../router";
import { trpc } from "../trpcUtil";

export const Auth = (): JSX.Element => {
  const { router } = useRouter();

  const searchParam = useSearchParam(z.object({ code: z.string() }));
  const { mutate } = trpc.auth.login.useMutation();
  const queryClient = useQueryClient();

  const auth = useCallback(() => {
    if (!searchParam.success) {
      return;
    }
    mutate(
      {
        oauthToken: searchParam.data.code,
      },
      {
        onSuccess: () => {
          queryClient
            .invalidateQueries(trpc.auth.currentUser.getQueryKey())
            .then(() => {
              router.push("/");
            });
        },
      }
    );
  }, [mutate, router, searchParam, queryClient]);

  return <><button onClick={auth}>a</button></>;
};
