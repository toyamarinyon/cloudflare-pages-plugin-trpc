export const onRequestGet = async () => {
  console.log('a')
  const response = await fetch("https://api.github.com/user", {
    headers: {
      'User-Agent': 'request',
      Authorization: `Bearer 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`,
    },
  });
  console.log('b')
  console.log(response.status)
  return new Response(await response.json());
};
