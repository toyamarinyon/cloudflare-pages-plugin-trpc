import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}
export const Page = ({ title, children }: Props): JSX.Element => {
  return (
    <>
      <h1 className="text-xl text-slate-900 font-bold mb-8">{title}</h1>
      {children}
    </>
  );
};
