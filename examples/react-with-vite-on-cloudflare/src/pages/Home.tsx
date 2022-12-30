import { trpc } from "../trpcUtil";
import { PlusIcon } from "@heroicons/react/solid";
import { addRoute } from "../Router";
import { Link } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { Task } from "../components/Task";

export const Home = (): JSX.Element => {
  const postQuery = trpc.tasks.list.useQuery();
  if (postQuery.isInitialLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Page title="Tasks">
      {postQuery.isFetching ? (
        <div>loading...</div>
      ) : postQuery.data?.tasks == null ? (
        <div>no tasks</div>
      ) : (
        <ul className="mb-2 divide-y divide-slate-200 border-b border-slate-200 mb-4">
          {postQuery.data.tasks.map((task) => (
            <li key={task.id} className="py-2">
              <Task {...task} />
            </li>
          ))}
        </ul>
      )}
      <Link
        to={addRoute.id}
        className="flex items-center space-x-1 text-slate-500"
      >
        <PlusIcon className="w-4" />
        <span className="text-sm">Add task</span>
      </Link>
    </Page>
  );
};
