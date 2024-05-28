import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { randomUUID } from "node:crypto";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { r2 } from "./r2";

const app = new Hono();

app.use(cors());

app.post("/pre-signed-url", async (c) => {
  const key = randomUUID();
  const bucket = process.env.R2_BUCKET!;

  const url = await getSignedUrl(r2, new PutObjectCommand({ Bucket: bucket, Key: key }));

  return c.json({ key, url });
});

app.get("/file/:key", async (c) => {
  const key = c.req.param("key");

  const bucket = process.env.R2_BUCKET!;
  const url = await getSignedUrl(r2, new GetObjectCommand({ Bucket: bucket, Key: key }));

  return c.json({ key, url });
});

serve({ fetch: app.fetch, port: 3000 });

console.log("🌎 listening on port 3000");
