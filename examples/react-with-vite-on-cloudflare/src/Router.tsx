import { HeartIcon } from "@heroicons/react/solid";
import {
  createReactRouter,
  createRouteConfig,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { AddTask } from "./pages/AddTask";
import { Home } from "./pages/Home";

const rootRoute = createRouteConfig({
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
const routeConfig = rootRoute.addChildren([indexRoute, addRoute]);
const router = createReactRouter({ routeConfig });

export function Router() {
  return <RouterProvider router={router} />;
}
