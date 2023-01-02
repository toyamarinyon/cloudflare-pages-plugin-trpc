import { trpc } from "../trpcUtil";
import { useRouter } from "../router";
import { ReactNode, useEffect } from "react";

export const AuthGuard = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { router } = useRouter();
  const { isInitialLoading, data } = trpc.auth.currentUser.useQuery();
  useEffect(() => {
    if (!isInitialLoading && data?.currentUser == null) {
      router.push("/login");
    }
  }, [isInitialLoading, data?.currentUser, router]);
  if (isInitialLoading || data?.currentUser == null) {
    return <></>;
  }
  return <>{children}</>;
};
