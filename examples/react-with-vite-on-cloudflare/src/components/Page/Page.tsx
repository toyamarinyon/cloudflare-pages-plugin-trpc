import { HeartIcon } from "@heroicons/react/solid";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}
export const Page = ({ title, children }: Props): JSX.Element => {
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
        <h1 className="text-xl text-slate-900 font-bold mb-8">{title}</h1>
        {children}
      </section>
    </div>
  );
};
