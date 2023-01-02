import { createWebCryptSession } from "webcrypt-session";
import { z } from "zod";
import { getAccessToken, getUser } from "../../../src/model/github";
import { sessionScheme } from "../../../src/model/session";
import { Env } from "../[[trpc]]";

export const onRequestGet = async ({
  request,
  env,
}: EventContext<Env, "", Record<string, unknown>>) => {
  const unsafeParams = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );
  const params = z.object({ code: z.string() }).parse(unsafeParams);
  const accessToken = await getAccessToken({
    code: params.code,
    clientId: env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
  });
  const githubUser = await getUser(accessToken);
  const user = await env.DB.prepare(
    "SELECT id FROM users WHERE github_user_id = ?"
  )
    .bind(githubUser.id)
    .all<{ id: number }>();

  /**
   * @todo use const
   */
  let dbUserId = user?.results?.[0]?.id;
  if (dbUserId == null) {
    await env.DB.prepare(
      "INSERT INTO users (github_user_id, github_oauth_token) VALUES (?, ?)"
    )
      .bind(githubUser.id, accessToken)
      .run();
    const { id } = await env.DB.prepare(
      "SELECT last_insert_rowid() as id"
    ).first<{ id: number }>();
    dbUserId = id;
  } else {
    await env.DB.prepare("UPDATE users SET github_oauth_token = ? WHERE id = ?")
      .bind(accessToken, dbUserId)
      .run();
  }
  const sessionId = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (id, user_id) VALUES (?, ?)")
    .bind(sessionId, dbUserId)
    .run();

  const session = await createWebCryptSession(sessionScheme, request, {
    password: env.SESSION_SECRET,
  });
  await session.save({ id: sessionId });
  const url = new URL(request.url);
  const sessionValue = session.toHeaderValue() ?? "";
  return new Response(
    `<html><head><meta http-equiv="refresh" content="1;URL=${url.protocol}//${url.host}"></head><body></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Set-Cookie": `${sessionValue}; Secure; HttpOnly; SameSite=Lax; Path=/;`,
      },
    }
  );
};
