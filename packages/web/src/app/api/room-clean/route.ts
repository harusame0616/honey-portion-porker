import { createClient } from "@/lib/supabase/server";
import { sub } from "date-fns";
import { NextRequest } from "next/server";

async function cleanRoom() {
  const client = await createClient();

  await client
    .from("room")
    .delete()
    .lt("updatedAt", sub(new Date(), { days: 30 }).toISOString());
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await cleanRoom();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
