import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const realTimeNewsApiKey = Deno.env.get('REALTIME_NEWS_API_KEY')!
const reutersApiKey = Deno.env.get('REUTERS_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting news fetch process...')

    // Fetch news from Real-Time News API
    const realTimeNewsResponse = await fetch(
      'https://real-time-news-data.p.rapidapi.com/search?query=Nigeria&country=NG&lang=en',
      {
        headers: {
          'X-RapidAPI-Key': realTimeNewsApiKey,
          'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
        }
      }
    )

    if (!realTimeNewsResponse.ok) {
      console.error('Real-Time News API error:', await realTimeNewsResponse.text())
      throw new Error(`Real-Time News API error: ${realTimeNewsResponse.statusText}`)
    }

    const realTimeNewsData = await realTimeNewsResponse.json()
    console.log(`Fetched ${realTimeNewsData.data?.length || 0} articles from Real-Time News API`)

    // Fetch news from Reuters API
    const reutersResponse = await fetch(
      'https://reuters-business-and-financial-news.p.rapidapi.com/article-date/01-01-2024',
      {
        headers: {
          'X-RapidAPI-Key': reutersApiKey,
          'X-RapidAPI-Host': 'reuters-business-and-financial-news.p.rapidapi.com'
        }
      }
    )

    if (!reutersResponse.ok) {
      console.error('Reuters API error:', await reutersResponse.text())
      throw new Error(`Reuters API error: ${reutersResponse.statusText}`)
    }

    const reutersData = await reutersResponse.json()
    console.log(`Fetched ${reutersData.length || 0} articles from Reuters API`)

    // Process Real-Time News articles
    const realTimeArticles = (realTimeNewsData.data || []).map((article: any) => ({
      title: article.title,
      content: article.description,
      image_url: article.image_url,
      source_url: article.link,
      is_draft: true,
      created_at: new Date().toISOString()
    }))

    // Process Reuters articles
    const reutersArticles = (reutersData || []).map((article: any) => ({
      title: article.title,
      content: article.description,
      image_url: article.image,
      source_url: article.url,
      is_draft: true,
      created_at: new Date().toISOString()
    }))

    // Combine articles from both sources
    const allArticles = [...realTimeArticles, ...reutersArticles]

    // Get news category ID
    const { data: newsCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'News')
      .single()

    if (!newsCategory?.id) {
      throw new Error('News category not found')
    }

    // Add category ID to articles
    const articlesWithCategories = allArticles.map(article => ({
      ...article,
      category_id: newsCategory.id
    }))

    console.log(`Attempting to insert ${articlesWithCategories.length} articles...`)

    // Insert articles into database using the unique constraint
    const { data: insertedArticles, error: insertError } = await supabase
      .from('posts')
      .upsert(
        articlesWithCategories,
        {
          onConflict: 'title,source_url',
          ignoreDuplicates: true
        }
      )

    if (insertError) {
      console.error('Error inserting articles:', insertError)
      throw insertError
    }

    console.log('Articles inserted successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${articlesWithCategories.length} articles` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-nigerian-news function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while fetching news' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})