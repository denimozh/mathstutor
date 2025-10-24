import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {
        const supabase = createClient();
        const { data, error } = (await supabase).from('questions').select('*');
        if (error) throw error;
        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { text, topic, struggled } = body;

        const { data, error } = await supabase.from('questions').insert([
            { text, topic, struggled }
        ]);

        if (error) throw error;
        return Response.json({ success: true, data: data });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}