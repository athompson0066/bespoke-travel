import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { price_id } = await req.json()
        // Validation: ensure price_id is provided
        if (!price_id) {
            throw new Error("Price ID is required");
        }

        // Get the Authorization header from the request
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error("Missing Authorization header");
        }

        // Create a Supabase client with the user's token
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        // Get the user from the token
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error("User not found");
        }

        const origin = req.headers.get('origin') || 'http://localhost:5173'

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price_id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
            client_reference_id: user.id, // Associate the session with the user
        })

        return new Response(
            JSON.stringify({ session }),
            { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
    }
})
