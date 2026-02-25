
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '';
let key = '';
for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1];
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1];
}

const supabase = createClient(url, key);

async function test() {
    console.log("Invoking edge function...");
    const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: {
            email: "test@example.com",
            clientName: "Test Client",
            agentName: "Bespoke AI",
            agentBusiness: "Bespoke AI",
            itinerary: { destination: "Test", itinerary: [], tips: { currency: "USD", tipping: "20%", dressCode: "Casual", etiquette: "None" } }
        }
    });

    if (error) {
        console.log("Error object:", error);
        // FunctionsHttpError has a context usually
        if (error.context) {
            // Try to read the body of the response
            try {
                const body = await error.context.json();
                console.log("Error JSON body:", body);
            } catch (e) {
                const text = await error.context.text();
                console.log("Error Text body:", text);
            }
        }
    } else {
        console.log("Data:", data);
    }
}

test();
