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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const groqKey     = Deno.env.get('GROQ_API_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!;

    // 1. Upload audio to Supabase Storage
    const audioBytes = await audioFile.arrayBuffer();
    const ext = audioFile.type.includes('mp4') ? 'm4a' : 'webm';
    const audioPath = `${activityId}/${crypto.randomUUID()}.${ext}`;

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/audio-reflections/${audioPath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': audioFile.type || 'audio/webm',
          'x-upsert': 'true',
        },
        body: audioBytes,
      }
    );
    if (!uploadRes.ok) {
      console.error('Storage upload failed:', await uploadRes.text());
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
          content: `A parent just tried the "${activityTitle}" SEL activity with their ${childAge ?? 'young'}-year-old child and recorded this spoken reflection:\n\n"${transcript}"\n\nWrite 2–3 short bullet points summarizing what happened, how the child responded, and any notable moments. Be concise and warm. Start each bullet with •`,
        }],
      }),
    });
    if (!claudeRes.ok) throw new Error(`Claude error: ${await claudeRes.text()}`);
    const claudeData = await claudeRes.json();
    const summary = claudeData.content[0].text as string;

    // 4. Save to DB
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/reflections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        activity_id: activityId,
        activity_title: activityTitle,
        child_age: childAge ? parseInt(childAge) : null,
        audio_path: audioPath,
        transcript,
        summary,
      }),
    });
    if (!dbRes.ok) console.error('DB insert failed:', await dbRes.text());

    return new Response(JSON.stringify({ transcript, summary }), {
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
