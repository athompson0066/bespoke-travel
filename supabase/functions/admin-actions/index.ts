import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, userId } = await req.json()

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error("Missing Authorization header");
        }

        // 1. Authenticate the caller
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error("Unauthorized");
        }

        // 2. Authorize as Admin
        if (user.email !== 'rootsafrikiko@gmail.com') {
            throw new Error("Forbidden: Not an admin");
        }

        // 3. Service role client for privileged actions
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        if (action === 'delete_user') {
            if (!userId) throw new Error("userId required");
            const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
            if (deleteError) throw deleteError;
            return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
