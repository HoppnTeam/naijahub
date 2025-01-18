import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchRealtimeNews() {
  const response = await fetch('https://real-time-news-data.p.rapidapi.com/search?query=Nigeria&country=NG&lang=en', {
    headers: {
      'X-RapidAPI-Key': Deno.env.get('REALTIME_NEWS_API_KEY') ?? '',
      'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
    }
  });
  
  const data = await response.json();
  console.log('Realtime News API response:', data);
  return data.data || [];
}

async function fetchReutersNews() {
  const response = await fetch('https://reuters-business-and-financial-news.p.rapidapi.com/news-headlines', {
    headers: {
      'X-RapidAPI-Key': Deno.env.get('REUTERS_API_KEY') ?? '',
      'X-RapidAPI-Host': 'reuters-business-and-financial-news.p.rapidapi.com'
    }
  });
  
  const data = await response.json();
  console.log('Reuters API response:', data);
  return data.headlines || [];
}

function mapNewsToCategory(article: any, source: string) {
  // Define keywords for each category
  const categoryKeywords = {
    'News & Politics': ['politics', 'government', 'election', 'policy', 'minister', 'president'],
    'Business': ['business', 'economy', 'market', 'trade', 'finance', 'stock', 'investment'],
    'Technology': ['tech', 'technology', 'digital', 'software', 'startup', 'innovation'],
    'Sports': ['sport', 'football', 'soccer', 'athlete', 'tournament', 'championship'],
    'Entertainment': ['entertainment', 'movie', 'music', 'celebrity', 'artist', 'culture'],
    'Health': ['health', 'medical', 'hospital', 'disease', 'treatment', 'doctor'],
  };

  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || article.content?.toLowerCase() || '';
  const content = title + ' ' + description;

  // Find matching category based on keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }

  return 'News & Politics'; // Default category
}

function normalizeArticle(article: any, source: string) {
  const category = mapNewsToCategory(article, source);
  
  if (source === 'realtime') {
    return {
      title: article.title,
      content: article.description,
      image_url: article.image_url,
      source_url: article.link,
      category_id: null, // Will be set later
      is_draft: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else { // Reuters
    return {
      title: article.title,
      content: article.description || article.text,
      image_url: article.banner_image,
      source_url: article.news_url,
      category_id: null, // Will be set later
      is_draft: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching news from multiple sources...');
    
    // Fetch news from both sources
    const [realtimeNews, reutersNews] = await Promise.all([
      fetchRealtimeNews(),
      fetchReutersNews()
    ]);

    console.log(`Fetched ${realtimeNews.length} realtime news articles and ${reutersNews.length} Reuters articles`);

    // Get categories from database
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    if (!categories) {
      throw new Error('Failed to fetch categories');
    }

    // Normalize and combine articles
    const normalizedArticles = [
      ...realtimeNews.map(article => normalizeArticle(article, 'realtime')),
      ...reutersNews.map(article => normalizeArticle(article, 'reuters'))
    ];

    // Map category names to IDs and prepare articles for insertion
    const articlesWithCategories = normalizedArticles.map(article => {
      const categoryName = mapNewsToCategory(article, '');
      const category = categories.find(c => c.name === categoryName);
      return {
        ...article,
        category_id: category?.id || null
      };
    });

    // Insert articles into database using the new unique constraint
    const { data: insertedArticles, error } = await supabase
      .from('posts')
      .upsert(
        articlesWithCategories,
        { 
          onConflict: 'title,source_url',
          ignoreDuplicates: true
        }
      );

    if (error) {
      throw error;
    }

    console.log(`Successfully processed ${articlesWithCategories.length} articles`);

    return new Response(
      JSON.stringify({
        message: 'News articles fetched and stored successfully',
        count: articlesWithCategories.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
})