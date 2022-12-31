import { z } from "zod";

const CLIENT_ID = "";
const CLIENT_SECRET = "";

/**
 * @see https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
 */
export const userScheme = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
});

export const getUser = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      "content-type": "application/json",
      "user-agent": "cloudflare-worker",
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return userScheme.parse(await response.json());
};

export const accessTokenScheme = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
});
export const getAccessToken = async (code: string) => {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "cloudflare-worker",
      accept: "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }),
  });
  return accessTokenScheme.parse(await response.json()).access_token;
};
