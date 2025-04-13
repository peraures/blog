console.log(code)

export async function onRequest(context) {
    if (context.request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }
  
    const url = new URL(context.request.url);
    const code = url.searchParams.get("code");
  
    if (!code) {
      return new Response("Missing code parameter", { status: 400 });
    }
  
    const clientId = context.env.GITHUB_CLIENT_ID;
    const clientSecret = context.env.GITHUB_CLIENT_SECRET;
  
    try {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });
  
      const tokenData = await tokenRes.json();
  
      if (tokenData.error) {
        console.log("GitHub token error:", tokenData);
        return new Response(JSON.stringify(tokenData), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      return new Response(JSON.stringify(tokenData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Unexpected error during token exchange:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  