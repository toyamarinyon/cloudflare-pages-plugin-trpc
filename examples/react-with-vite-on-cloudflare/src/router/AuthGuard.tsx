import { trpc } from "../trpcUtil";
import { useRouter } from "../router";
import { ReactNode, useEffect } from "react";

export const AuthGuard = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { router } = useRouter();
  const { isLoading, data } = trpc.auth.currentUser.useQuery();
  useEffect(() => {
    if (!isLoading && data?.currentUser == null) {
      router.push("/login");
    }
  }, [isLoading, data?.currentUser, router]);
  if (isLoading || data?.currentUser == null) {
    return <></>;
  }
  return <>{children}</>;
};
