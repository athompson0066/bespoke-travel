
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { render } from "npm:@react-email/render@0.0.7";
import { ItineraryEmail } from "./ItineraryEmail.tsx";
import * as React from "npm:react@18.2.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ItineraryRequest {
  email: string
  clientName: string
  agentName?: string
  agentBusiness?: string
  itinerary: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, clientName, agentName, agentBusiness, itinerary } = await req.json() as ItineraryRequest

    if (!email) {
      throw new Error('Email is required')
    }

    // Render the React Email component
    const emailHtml = await render(
      React.createElement(ItineraryEmail, {
        clientName: clientName,
        agentName: agentName,
        agentBusiness: agentBusiness,
        destination: itinerary.destination,
        itinerary: itinerary.itinerary,
        tips: itinerary.tips,
      })
    );

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Bespoke AI <info@aiolosmedia.com>';
    console.log("Sending email from:", fromEmail);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your Luxury Itinerary: ${itinerary.destination}`,
      html: emailHtml,
    })

    console.log("Resend API Response:", JSON.stringify({ data, error }, null, 2))

    if (error) {
      console.error("Resend Error:", error)
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("Function Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
