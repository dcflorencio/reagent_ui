import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export async function POST(req: NextRequest): Promise<NextResponse<any>> {
    console.log("get-email-data api called");
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, status: 405, data: { error: 'Method not allowed' } });
    }

    const data = await req.json();
    console.log("data", data);
    return NextResponse.json({ success: true, status: 200, data: data });
}
