import { CheckIcon } from "@heroicons/react/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Task as TaskModel } from "../../model/task";
import { trpc } from "../../trpcUtil";

type Props = TaskModel;
export const Task = ({ title, description, id }: Props): JSX.Element => {
  const { mutateAsync } = trpc.tasks.complete.useMutation();
  const queryClient = useQueryClient();
  const completeTask = useCallback(async () => {
    await mutateAsync(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.tasks.list.getQueryKey());
        },
      }
    );
  }, [id, mutateAsync, queryClient]);
  return (
    <div className="flex space-x-2 text-slate-600">
      <button
        className="w-5 h-5 rounded-full border border-gray-300 shadow-sm mt-1 text-transparent hover:text-slate-300"
        onClick={completeTask}
      >
        <CheckIcon />
      </button>
      <div className="">
        <h2 className="">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};
