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
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Here is a parent's spoken reflection after doing the "${activityTitle}" activity with their child (auto-transcribed, so it may have filler words or stray transcription errors):\n\n"${transcript}"\n\nClean this up into a tidy written note in the parent's own first-person voice ("I…", "we…", their child's name if they used it). The reflection prompts asked three things, so ORGANIZE the note around whichever of these the parent actually spoke to, in this order:\n1. How it went / what they noticed about their child\n2. What they'd try differently next time\n3. A tip they'd share with another parent\n\nWrite one short paragraph per theme they covered, separated by a blank line. Skip any theme they didn't mention — do not invent one.\n\nStrict rules:\n- KEEP IT SHORT: the entire note must be under 60 words (about 3 short sentences). Tight and scannable — if they rambled, keep only the substance.\n- FAITHFUL, not creative. Only use what they actually said. Do NOT add feelings, interpretations, praise, advice, warmth, or any detail they didn't state. If they were brief, the note is brief — even one sentence is fine.\n- Remove filler ("um", "like", "you know"), false starts, and repetition; fix grammar/punctuation; keep their own wording wherever you can.\n- Plain prose only — no bullet points, no headings, no bold, no labels like "What went well:". Just natural paragraphs.\n- Never address them as "you", never ask for more, never apologize, never mention the transcription. Output only the cleaned-up note.`,
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
