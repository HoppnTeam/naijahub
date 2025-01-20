import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const REUTERS_API_KEY = Deno.env.get('REUTERS_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting news fetch operation...')

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch news from Reuters API
    const reutersResponse = await fetch(
      'https://api.reuters.com/v2/news/top-news?language=en&region=ng',
      {
        headers: {
          'Authorization': `Bearer ${REUTERS_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    )

    if (!reutersResponse.ok) {
      throw new Error(`Reuters API error: ${reutersResponse.statusText}`)
    }

    const reutersData = await reutersResponse.json()
    console.log(`Fetched ${reutersData.articles?.length || 0} articles from Reuters API`)

    // Process and store articles
    const articles = reutersData.articles || []
    const processedArticles = articles.map((article: any) => ({
      title: article.headline || article.title,
      content: article.body || article.description,
      source_url: article.url,
      image_url: article.media?.[0]?.url,
      is_draft: true,
      category_id: null, // Will be set by admin
      user_id: null // System generated content
    }))

    // Batch insert articles into Supabase
    const { data, error } = await supabase
      .from('posts')
      .upsert(
        processedArticles,
        { 
          onConflict: 'source_url',
          ignoreDuplicates: true 
        }
      )

    if (error) {
      throw error
    }

    console.log(`Successfully stored ${processedArticles.length} articles in Supabase`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fetched and stored ${processedArticles.length} articles`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in fetch-nigerian-news:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})