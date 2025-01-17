import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY')
    if (!RAPID_API_KEY) {
      throw new Error('RAPID_API_KEY is not set')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch news from NewsAPI via RapidAPI
    const response = await fetch('https://news-api14.p.rapidapi.com/top-headlines?country=ng&language=en&pageSize=10', {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
      }
    })

    const data = await response.json()
    console.log('Fetched news:', data)

    // Transform and store news articles as draft posts
    if (data.articles) {
      for (const article of data.articles) {
        // Get the News & Politics category ID
        const { data: categories } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'News & Politics')
          .single()

        if (!categories?.id) {
          console.error('News & Politics category not found')
          continue
        }

        // Create a draft post from the news article
        const { error } = await supabase
          .from('posts')
          .insert({
            title: article.title,
            content: `${article.description}\n\nSource: ${article.source.name}\n\nOriginal article: ${article.url}`,
            image_url: article.urlToImage,
            category_id: categories.id,
            is_draft: true, // Add this column to posts table
            source_url: article.url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error storing article:', error)
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'News articles fetched and stored successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})