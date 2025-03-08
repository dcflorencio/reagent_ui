// Import necessary modules
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/hooks/getUser';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Named export for the GET method
export const GET = async (req: NextRequest) => {
    try {
        const userData = await getUser();
        console.log("userData", userData);
        if (!userData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user_id = userData?.id;

        // Fetch saved properties for the user
        const { data, error } = await supabase
            .from('chat_history')
            .select('messages, created_at')
            .eq('user_id', user_id);

        // Handle errors
        if (error) {
            console.error('Error fetching saved chat:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return the data
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching saved chat:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
