// Import necessary modules
import { createClient } from '@supabase/supabase-js';
// import { Client } from "@googlemaps/google-maps-services-js";
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/hooks/getUser';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Named export for the POST method
export const POST = async (req: NextRequest) => {
    try {
        const { messages } = await req.json();
        if (!messages) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }
        const userData = await getUser();
        console.log("userData", userData);
        if (!userData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user_id = userData?.id;
        // Fetch parcel details
        const { data, error } = await supabase
            .from('chat_history')
            .insert([
                { messages: messages, user_id: user_id }
            ]);
        // Handle errors
        if (error) {
            console.error('Error saving chat messages:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log("Chat saved");
        console.log("data", JSON.stringify(data));
        // Return the data
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error saving chat messages:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
