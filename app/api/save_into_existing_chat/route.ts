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
        const { messages, properties } = await req.json();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        console.log("id", id);
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        if (!messages && !properties) {
            return NextResponse.json({ error: 'Messages and properties are required' }, { status: 400 });
        }
        const userData = await getUser();
        console.log("userData", userData);
        if (!userData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user_id = userData?.id;
        // Fetch parcel details
        const updateData: any = {};
        if (messages !== null) {
            updateData.messages = messages;
        }
        if (properties !== null) {
            updateData.properties = properties;
        }
        const { data, error } = await supabase
            .from('chat_history')
            .update(updateData)
            .eq('id', id)
            .select();
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
