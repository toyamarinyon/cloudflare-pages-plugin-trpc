import { HeartIcon } from "@heroicons/react/solid";
import {
  createReactRouter,
  createRouteConfig,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AddTask } from "./pages/AddTask";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";

export const rootRoute = createRouteConfig({
  component: () => (
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
  ),
});
export const indexRoute = rootRoute.createRoute({
  path: "/",
  component: Home,
});
export const addRoute = rootRoute.createRoute({
  path: "/add",
  component: AddTask,
});
export const loginRoute = rootRoute.createRoute({
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
export const authRoute = rootRoute.createRoute({
  path: "/auth",
  component: Auth,
});
const routeConfig = rootRoute.addChildren([
  indexRoute,
  addRoute,
  loginRoute,
  authRoute,
]);
const router = createReactRouter({ routeConfig });

export function Router() {
  return <RouterProvider router={router} />;
}
