import { Task as TaskModel } from "../../model/task";

type Props = TaskModel;
export const Task = ({ title, description }: Props): JSX.Element => {
  return (
    <div className="flex space-x-2 cursor-pointer text-slate-600">
      <span className="w-5 h-5 rounded-full border border-gray-300 shadow-sm mt-1"></span>
      <div className="">
        <h2 className="">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};
