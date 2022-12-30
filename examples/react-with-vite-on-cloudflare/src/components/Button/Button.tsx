import cn from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

const Loader = (): JSX.Element => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

type Props = {
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">;
export const Button = (props: Props): JSX.Element => {
  return (
    <button
      type={props.type}
      className={cn(
        "flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-md",
        "disabled:opacity-75",
        { "w-full": props.fullWidth }
      )}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <div className="flex items-center space-x-1">
          <Loader />
          <span>Loading</span>
        </div>
      ) : (
        <span>{props.children}</span>
      )}
    </button>
  );
};
