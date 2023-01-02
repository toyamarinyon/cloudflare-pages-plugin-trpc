import {
  AnchorHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  MouseEventHandler,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useState,
} from "react";
import { BrowserHistory, createBrowserHistory } from "history";
import { Home } from "../pages/Home";
import { AddTask } from "../pages/AddTask";
import { Login } from "../pages/Login";
import { AuthGuard } from "./AuthGuard";
import { Auth } from "../pages/Auth";
import { AnyZodObject, SafeParseReturnType } from "zod";
interface Router {
  history: BrowserHistory;
}
const RouterContext = createContext<Router>({} as Router);

type LinkProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "onClick"
> & {
  to: string;
};
export const Link = ({ to, children, ...props }: LinkProps) => {
  const { router } = useRouter();
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      event.preventDefault();
      router.push(to);
    },
    [router, to]
  );
  return (
    <a {...props} onClick={handleClick} href={to}>
      {children}
    </a>
  );
};

export const useRouter = () => {
  const router = useContext(RouterContext);
  return { router: router.history };
};

export function useSearchParam<T extends AnyZodObject>(scheme: T) {
  const router = useContext(RouterContext);
  const searchParam = useMemo<
    SafeParseReturnType<T["_input"], T["_output"]>
  >(() => {
    const searchParams = Object.fromEntries(
      new URLSearchParams(router.history.location.search).entries()
    );
    return scheme.safeParse(searchParams);
  }, [router.history.location.search, scheme]);
  return searchParam;
}

export const Router = (): JSX.Element => {
  const history = useMemo(() => createBrowserHistory(), []);
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(() => {
    const cleanup = history.listen(({ location }) => {
      setPathname(location.pathname);
    });
    return () => {
      cleanup();
    };
  }, [history]);
  return (
    <RouterContext.Provider value={{ history }}>
      {pathname === "/" && (
        <AuthGuard>
          <Home />
        </AuthGuard>
      )}
      {pathname === "/tasks/new" && (
        <AuthGuard>
          <AddTask />
        </AuthGuard>
      )}
      {pathname === "/login" && <Login />}
      {pathname === "/auth" && <Auth />}
    </RouterContext.Provider>
  );
};
