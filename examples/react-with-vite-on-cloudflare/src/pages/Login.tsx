export const Login = (): JSX.Element => (
  <div className="flex items-center justify-center h-screen w-full">
    <div className="bg-blue-700 flex-1 h-full flex items-center justify-center text-white">
      <section>
        <h1 className="text-5xl font-bold leading-snug">Hello, developer.</h1>
        <h2 className="text-xl">
          This is the todo app on the Edge with Cloudflare D1 and tRPC.
        </h2>
      </section>
    </div>
    <div className="bg-slate-300 flex-1 h-full flex items-center justify-center text-slate-700">
      <section>
        <a
          className="flex space-x-2 border-2 border-slate-700 rounded-md px-4 py-2"
          href={`https://github.com/login/oauth/authorize?client_id=${
            import.meta.env.VITE_GITHUB_OAUTH_APP_CLIENT_ID
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 fill-slate-900"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
            ></path>
          </svg>
          <span>Continue with GitHub</span>
        </a>
      </section>
    </div>
  </div>
);
