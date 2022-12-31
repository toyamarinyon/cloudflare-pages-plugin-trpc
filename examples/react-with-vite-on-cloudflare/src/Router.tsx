import { HeartIcon } from "@heroicons/react/solid";
import {
  createReactRouter,
  createRouteConfig,
  Outlet,
  RouterProvider,
  useMatch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { AddTask } from "./pages/AddTask";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import { trpcClient } from "./trpcUtil";

const AppGuard = () => {
  const {
    loaderData: { currentUser },
    navigate,
  } = useMatch(authenticatedRoute.id);
  useEffect(() => {
    if (currentUser == null) {
      navigate({ to: loginRoute.id });
    }
  }, [navigate, currentUser]);

  if (currentUser == null) {
    <></>;
  }

  return (
    <div className="">
      <section className="text-center text-xs bg-slate-200 py-1 text-slate-500">
        <div className="flex item-center space-x-1 justify-center">
          <span>This app is powered by Cloudflare D1</span>
          <HeartIcon className="w-4" />
          <span>
            <a
              href="https://github.com/toyamarinyon/cloudflare-pages-plugin-trpc"
              target="_blank"
            >
              cloudflare-pages-plugin-trpc
            </a>
            .
          </span>
        </div>
      </section>
      <section className="mx-auto max-w-xl py-4 mt-14">
        <Outlet />
      </section>
    </div>
  );
};

export const r = createRouteConfig({
  component: () => <Outlet />,
});

export const authenticatedRoute = r.createRoute({
  path: "/app",
  loader: async () => await trpcClient.auth.currentUser.query(),
  component: AppGuard,
});

export const homeRoute = authenticatedRoute.createRoute({
  path: "/",
  component: Home,
});

export const addRoute = authenticatedRoute.createRoute({
  path: "/add",
  component: AddTask,
});
export const loginRoute = r.createRoute({
  path: "/login",
  component: () => (
    <div>
      this is login
      <a
        href="https://github.com/login/oauth/authorize?client_id=9df57f381a50ef66d3e7"
        target="_blank"
      >
        https://github.com/login/oauth/authorize?client_id=9df57f381a50ef66d3e7
      </a>
    </div>
  ),
});
export const authRoute = r.createRoute({
  path: "/auth",
  validateSearch: z.object({ code: z.string() }),
  component: Auth,
});
const routeConfig = r.addChildren([
  authenticatedRoute.addChildren([homeRoute, addRoute]),
  loginRoute,
  authRoute,
]);
const router = createReactRouter({ routeConfig });

export function Router() {
  return <RouterProvider router={router} />;
}
declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
