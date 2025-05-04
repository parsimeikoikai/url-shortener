import { supabase } from "../utils/supabaseClient";
import { generateShortCode } from "../utils/generateShortCode";

export const createShortLink = async (original_url: string) => {
  const { data: existingUrlData, error: existingUrlError } = await supabase
    .from("short_links")
    .select("short_code")
    .eq("original_url", original_url)
    .maybeSingle();

  if (existingUrlError) {
    throw new Error(existingUrlError.message);
  }

  if (existingUrlData) {
    return {
      short_code: existingUrlData.short_code,
      shortened_url: `http://localhost:4200/${existingUrlData.short_code}`,
      original_url,
      reused: true,
    };
  }

  const short_code = generateShortCode();

  const { data: existingCodeData, error: existingCodeError } = await supabase
    .from("short_links")
    .select()
    .eq("short_code", short_code);

  if (existingCodeError) throw new Error(existingCodeError.message);
  if (existingCodeData.length > 0) throw new Error("Short code already exists");

  const { data, error } = await supabase
    .from("short_links")
    .insert([{ original_url, short_code }]);

  if (error) throw new Error(error.message);

  return {
    short_code,
    shortened_url: `http://localhost:4200/${short_code}`,
    original_url,
    reused: false,
  };
};
export const getOriginalUrl = async (short_code: string) => {
  const { data, error } = await supabase
    .from("short_links")
    .select("original_url")
    .eq("short_code", short_code)
    .single();

  if (error || !data) throw new Error("Short code not found");
  return data.original_url;
};

export const getStatsByCode = async (short_code: string) => {
  console.log("Querying for short_code: ", short_code);

  const { data, error } = await supabase
    .from("short_links")
    .select("original_url, visit_count, created_at")
    .eq("short_code", short_code)
    .single();
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return {
      short_code,
      original_url: null,
      visit_count: null,
      created_at: null,
      message: "Short code not found",
    };
  }
  return data;
};
export const listAllUrls = async () => {
  const { data, error } = await supabase
    .from("short_links")
    .select("short_code, original_url,visit_count, created_at");

  if (error) throw new Error(error.message);
  return data;
};

export const incrementClickAndGetOriginal = async (short_code: string) => {
  const { data, error } = await supabase
    .from("short_links")
    .select("original_url, visit_count")
    .eq("short_code", short_code)
    .maybeSingle();

  if (error) {
    console.error("Supabase fetch error:", error.message);
    throw new Error("Database error");
  }

  if (!data) {
    throw new Error("Short code not found");
  }

  const newClickCount = (data.visit_count || 0) + 1;

  const { error: updateError } = await supabase
    .from("short_links")
    .update({
      visit_count: newClickCount,
      last_accessed: new Date().toISOString(),
    })
    .eq("short_code", short_code);

  if (updateError) {
    console.error("Supabase update error:", updateError.message);
    throw new Error("Failed to update click count");
  }

  return data.original_url;
};
