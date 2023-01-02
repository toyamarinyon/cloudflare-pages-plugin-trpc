declare global {
  const CLIENT_ID: string;
  const CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  console.log(JSON.stringify(env, null, 2))
  return new Response("hello");
};
