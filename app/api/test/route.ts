import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export async function POST(req: NextRequest): Promise<NextResponse<any>> {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, status: 405, data: { error: 'Method not allowed' } });
    }
    try {
        const { input, messages } = await req.json(); // Get query from request body
        if (!process.env.LANGGRAPH_API_KEY) {
            throw new Error("LANGGRAPH_API_KEY is not defined");
        }
        console.log("messages", JSON.stringify(messages));
        console.log("input", input);
        const apiResponse = await fetch('https://reagent-ui-3d6ba29f3428595b8a7ab36565570117.us.langgraph.app/runs/wait', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': process.env.LANGGRAPH_API_KEY
            },
            body: JSON.stringify({
                "assistant_id": "Real Estate",
                "input": {"messages":[{"role":"user", "content":"Can you show me some Houses to 'buy' in chicago city, illinois, US, with 2 BHK, with in 500 to 1000 usd"}, {"role":"assistant", "content":"To clarify, when you mention \"2 BHK,\" are you referring to 2 bedrooms and 1 bathroom, or do you need 2 bedrooms and 2 bathrooms? Additionally, is your budget of $500 to $1000 total budget or a total purchase price?"}, {"role":"user", "content":"yes, i need 2 bedrooms and 2 bathrooms"},{"role":"assistant", "content":"Thank you for the clarification! Just to confirm, is your budget of $500 to $1000 the total purchase price for the house?"}, {"role":"user", "content":"yes, total budget to buy"}]}
              })
          })
        console.log("apiResponse", JSON.stringify(apiResponse));
        return NextResponse.json({ apiResponse });
    } catch (error: any) {
        console.log("error", error)
        return NextResponse.json({ error: error.message }); // Handle errors
    }
}
