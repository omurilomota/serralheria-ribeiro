import { createClient } from "@supabase/supabase-js";

export async function uploadPortfolioImage(file: File): Promise<string | null> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";

  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, await file.arrayBuffer(), {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    console.error("[storage] upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}