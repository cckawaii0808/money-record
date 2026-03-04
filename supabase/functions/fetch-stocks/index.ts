import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 處理 CORS 預檢請求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get('target');

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing 'target' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 只有允許的 target 才能抓取，增加一點安全性
    let fetchUrl = "";
    if (target === "twse") {
      fetchUrl = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
    } else if (target === "tpex") {
      fetchUrl = "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes";
    } else {
       return new Response(JSON.stringify({ error: "Invalid target. Use 'twse' or 'tpex'" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 由 Edge Function 代為抓取這包超大的資料
    const res = await fetch(fetchUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
