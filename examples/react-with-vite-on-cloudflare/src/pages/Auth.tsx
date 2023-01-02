import { useEffect } from "react";
import { z } from "zod";
import { useRouter, useSearchParam } from "../router";
import { trpc } from "../trpcUtil";

export const Auth = (): JSX.Element => {
  const { router } = useRouter();

  const searchParam = useSearchParam(z.object({ code: z.string() }));
  const { mutate } = trpc.auth.login.useMutation();

  useEffect(() => {
    if (!searchParam.success) {
      return;
    }
    mutate({
      oauthToken: searchParam.data.code,
    });

    router.push("/");
  }, [mutate, router, searchParam]);

  return <></>;
};
