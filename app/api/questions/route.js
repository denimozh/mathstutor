import { createClient } from "@/utils/supabase/server.js";
export async function GET(request) {
    try {
        const supabase = await createClient();
        
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return Response.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }
        
        // Use RPC function to get questions
        const { data, error } = await supabase.rpc('get_user_questions', {
            p_user_id: user.id,
            p_limit: 100,  // or whatever limit you want
            p_offset: 0
        });
        
        if (error) throw error;
        
        return Response.json({ 
            success: true, 
            data: data || [] 
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, topic, struggled } = body;

    const supabase = await createClient();

    // Check the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session exists?', !!session);
    console.log('Session user:', session?.user?.id);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('getUser result:', user?.id);
    
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');

    // Try this - use service role to check what auth.uid() sees
    const { data: authCheck } = await supabase.rpc('get_auth_uid');
    console.log('What does auth.uid() see in RLS?', authCheck);
    
    const { data, error } = await supabase
    .rpc('insert_question', {
        p_user_id: user.id,
        p_text: text,
        p_topic: topic,
        p_struggled: struggled
    });

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}