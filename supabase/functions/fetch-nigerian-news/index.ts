import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const REALTIME_NEWS_API_KEY = Deno.env.get('REALTIME_NEWS_API_KEY')
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

    // Fetch news from Real-Time News API
    const realtimeNewsResponse = await fetch(
      'https://real-time-news-data.p.rapidapi.com/search?query=Nigeria&country=NG&lang=en',
      {
        headers: {
          'X-RapidAPI-Key': REALTIME_NEWS_API_KEY!,
          'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
        }
      }
    )

    if (!realtimeNewsResponse.ok) {
      throw new Error(`Real-Time News API error: ${realtimeNewsResponse.statusText}`)
    }

    const realtimeNewsData = await realtimeNewsResponse.json()
    console.log(`Fetched ${realtimeNewsData.data?.length || 0} articles from Real-Time News API`)

    // Process and store articles
    const articles = realtimeNewsData.data || []
    const processedArticles = articles.map((article: any) => ({
      title: article.title,
      content: article.content || article.description,
      source_url: article.link,
      image_url: article.image_url,
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