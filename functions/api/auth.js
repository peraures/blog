export async function onRequest(context) {
    const url = new URL(context.request.url);
    const code = url.searchParams.get("code");
  
    const clientId = context.env.GITHUB_CLIENT_ID;
    const clientSecret = context.env.GITHUB_CLIENT_SECRET;
  
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
  
    const tokenData = await tokenRes.json();
  
    return new Response(JSON.stringify(tokenData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  