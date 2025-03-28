import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/hooks/getUser';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const POST = async (req: NextRequest) => {
    try {
        const { first_name, last_name, email, message, reason } = await req.json();

        if (!first_name || !last_name || !email || !message || !reason) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const userData = await getUser();
        if (!userData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('query_data')
            .insert(
                { first_name, last_name, email, message, reason }
            )

        if (error) {
            console.error('Error saving query:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error saving query:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}