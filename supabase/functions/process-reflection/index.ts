import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const form = await req.formData();
    const audioFile  = form.get('audio')          as File;
    const activityId = form.get('activity_id')    as string;
    const activityTitle = form.get('activity_title') as string;
    const childAge   = form.get('child_age')      as string | null;
    const sessionId  = form.get('session_id')     as string | null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey  = Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const groqKey     = Deno.env.get('GROQ_API_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!;

    // 1. Upload audio to Supabase Storage
    const audioBytes = new Uint8Array(await audioFile.arrayBuffer());
    const ext = audioFile.type.includes('mp4') ? 'm4a' : 'webm';
    const contentType = audioFile.type || 'audio/webm';
    const audioPath = `${activityId}/${crypto.randomUUID()}.${ext}`;

    const supabase = createClient(supabaseUrl, serviceKey);
    const { error: uploadError } = await supabase.storage
      .from('audio-reflections')
      .upload(audioPath, audioBytes, { contentType, upsert: true });
    if (uploadError) {
      console.error('Storage upload failed:', uploadError.message);
    } else {
      console.log('Storage upload ok:', audioPath);
    }

    // 2. Transcribe with Groq Whisper
    const groqForm = new FormData();
    groqForm.append('file', new Blob([audioBytes], { type: audioFile.type }), `audio.${ext}`);
    groqForm.append('model', 'whisper-large-v3-turbo');
    groqForm.append('response_format', 'json');

    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}` },
      body: groqForm,
    });
    if (!groqRes.ok) throw new Error(`Groq error: ${await groqRes.text()}`);
    const { text: transcript } = await groqRes.json();

    // 3. Summarize with Claude
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `A parent just tried the "${activityTitle}" activity with their ${childAge ?? 'young'}-year-old child and recorded this spoken reflection:\n\n"${transcript}"\n\nRewrite it as a short, warm journal note in the PARENT'S OWN VOICE — first person, the way they'd write it themselves ("I…", "we…", "my son/daughter…"). Keep it to 1–2 flowing sentences of plain prose: no bullet points, no headings, no labels.\n\nRules:\n- Write as the parent, never in the third person. Never say "the parent" or "the child" — say "I", "we", or the child's name if they mentioned it.\n- Stay grounded in what they actually said; don't invent details or add advice.\n- If the recording is very short or vague, just tidy what they said into one natural sentence. Never ask for more, never apologize, never address them as "you".\n- Output only the note itself — no preamble.`,
        }],
      }),
    });
    if (!claudeRes.ok) throw new Error(`Claude error: ${await claudeRes.text()}`);
    const claudeData = await claudeRes.json();
    const summary = claudeData.content[0].text as string;

    // 4. Save to DB — return the new row's id so the client can offer
    //    "share to community" (a later PATCH flips `shared`).
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/reflections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        activity_id: activityId,
        activity_title: activityTitle,
        child_age: childAge ? parseInt(childAge) : null,
        audio_path: audioPath,
        transcript,
        summary,
        session_id: sessionId,
      }),
    });
    let reflectionId: string | null = null;
    if (dbRes.ok) {
      const rows = await dbRes.json();
      reflectionId = rows?.[0]?.id ?? null;
    } else {
      console.error('DB insert failed:', await dbRes.text());
    }

    return new Response(JSON.stringify({ transcript, summary, id: reflectionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
