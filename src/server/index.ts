import { createWishItem, listWishItems } from "./db";
import type { CreateWishItemInput } from "../shared/types";

const port = Number(process.env.PORT ?? 3000);
const clientDist = `${process.cwd()}/dist/client`;

const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    ...init
  });

const parseBody = async (request: Request): Promise<CreateWishItemInput> => {
  const payload = (await request.json()) as Partial<CreateWishItemInput>;

  if (!payload.title?.trim()) {
    throw new Error("A title is required.");
  }

  if (!payload.url?.trim()) {
    throw new Error("A URL is required.");
  }

  return {
    title: payload.title,
    url: payload.url,
    notes: payload.notes
  };
};

const handler = async (request: Request) => {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
      }
    });
  }

  if (url.pathname === "/api/items" && request.method === "GET") {
    return json({ items: listWishItems() });
  }

  if (url.pathname === "/api/items" && request.method === "POST") {
    try {
      const item = createWishItem(await parseBody(request));
      return json({ item }, { status: 201 });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create item.";

      return json({ error: message }, { status: 400 });
    }
  }

  const assetPath =
    url.pathname === "/" ? `${clientDist}/index.html` : `${clientDist}${url.pathname}`;
  const assetFile = Bun.file(assetPath);

  if (await assetFile.exists()) {
    return new Response(assetFile);
  }

  const indexFile = Bun.file(`${clientDist}/index.html`);

  if (await indexFile.exists()) {
    return new Response(indexFile);
  }

  return new Response("Frontend not built yet. Run `bun run build`.", {
    status: 404
  });
};

Bun.serve({
  port,
  fetch: handler
});

console.log(`API server running at http://localhost:${port}`);
