
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
    if (req.method === 'POST') {
        const signature = req.headers.get('stripe-signature')
        try {
            const body = await req.text()
            // Verify signature
            let event
            try {
                event = stripe.webhooks.constructEvent(body, signature!, endpointSecret!)
            } catch (err) {
                console.error(`Webhook signature verification failed: ${err.message}`)
                return new Response(`Webhook Error: ${err.message}`, { status: 400 })
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object
                const userId = session.client_reference_id
                const amount = session.amount_total

                if (userId && amount) {
                    const supabase = createClient(
                        Deno.env.get('SUPABASE_URL') ?? '',
                        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                    )

                    // Determine credits based on amount (cents)
                    // Starter: $9.99 -> 10 credits
                    // Professional: $39.99 -> 50 credits
                    // Agency: $299.99 -> 500 credits
                    let creditsToAdd = 0
                    if (amount === 999) creditsToAdd = 10
                    else if (amount === 3999) creditsToAdd = 50
                    else if (amount === 29999) creditsToAdd = 500

                    if (creditsToAdd > 0) {
                        // Increment credits
                        const { error } = await supabase.rpc('increment_credits', {
                            user_id: userId,
                            amount: creditsToAdd
                        })

                        if (error) {
                            console.error('Error incrementing credits:', error)
                            throw error
                        }

                        // Log transaction
                        await supabase.from('transactions').insert({
                            user_id: userId,
                            amount: amount,
                            credits_added: creditsToAdd,
                            stripe_session_id: session.id
                        })
                    }
                }
            }

            return new Response(JSON.stringify({ received: true }), {
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (err) {
            return new Response(`Webhook Error: ${err.message}`, { status: 400 })
        }
    }
    return new Response('Method not allowed', { status: 405 })
})
