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

    // Fetch jobs from RapidAPI
    const response = await fetch('https://jsearch.p.rapidapi.com/search?query=tech%20jobs%20nigeria&page=1&num_pages=1', {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    })

    const data = await response.json()
    console.log('Fetched external jobs:', data)

    // Transform and store jobs
    if (data.data) {
      for (const job of data.data) {
        const jobData = {
          external_id: job.job_id,
          source: 'rapidapi',
          title: job.job_title,
          company_name: job.employer_name,
          description: job.job_description,
          requirements: job.job_highlights?.Qualifications?.join('\n') || '',
          job_type: job.job_employment_type || 'full_time',
          location_type: job.job_is_remote ? 'remote' : 'onsite',
          location: job.job_city || job.job_country || 'Nigeria',
          salary_range: job.job_salary_currency ? `${job.job_salary_currency}${job.job_min_salary || ''}-${job.job_max_salary || ''}` : null,
          skills: [],
          application_url: job.job_apply_link
        }

        const { error } = await supabase
          .from('external_tech_jobs')
          .upsert(
            jobData,
            { onConflict: 'external_id,source' }
          )

        if (error) {
          console.error('Error storing job:', error)
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Jobs updated successfully' }),
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