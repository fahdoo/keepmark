import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url) throw new Error("URL is required");

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");

    // If Firecrawl is configured, use it for rich metadata
    if (apiKey) {
      console.log("Using Firecrawl for metadata extraction:", url);
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          formats: ["markdown", "summary"],
          onlyMainContent: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const metadata = data.data?.metadata || data.metadata || {};
        const summary = data.data?.summary || data.summary || null;

        return new Response(
          JSON.stringify({
            title: metadata.title || metadata.ogTitle || null,
            description: metadata.description || metadata.ogDescription || null,
            summary,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Firecrawl error, falling back:", response.status);
    }

    // Fallback: basic HTML fetch
    console.log("Using basic fetch for metadata:", url);
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Keepmark/1.0)" },
      redirect: "follow",
    });
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);

    return new Response(
      JSON.stringify({
        title: (ogTitleMatch?.[1] || titleMatch?.[1] || null)?.trim(),
        description: (ogDescMatch?.[1] || descMatch?.[1] || null)?.trim(),
        summary: null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ title: null, description: null, summary: null, error: e.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
