import {
  createReactRouter,
  createRouteConfig,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { AddTask } from "./pages/AddTask";
import { Home } from "./pages/Home";

const DummyComponent = (): JSX.Element => <div>dummy</div>;
const rootRoute = createRouteConfig({
  component: () => (
    <section className="mx-auto max-w-xl py-4 mt-14">
      <Outlet />
    </section>
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
