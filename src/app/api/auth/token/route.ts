
export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        username: body.username,
        password: body.password,
      }),
    }
  );

  const data = await response.json();

  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("uuid");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}/products/${uuid}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  return Response.json(data);
}