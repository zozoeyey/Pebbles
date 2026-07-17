// Voice reply pipeline: upload audio to Storage, transcribe with Groq Whisper,
// store as a public reply row (reply_text = transcript, audio kept private).
//
// Deploy:  supabase functions deploy process-reply
// Secrets: GROQ_API_KEY (already set for process-reflection)

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
    const audioFile = form.get('audio') as File;
    const reflectionRef = form.get('reflection_ref') as string;
    const activityId = form.get('activity_id') as string;
    const sessionId = form.get('session_id') as string | null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const groqKey = Deno.env.get('GROQ_API_KEY')!;

    // 1. Upload audio (same private bucket as reflections, under replies/)
    const audioBytes = new Uint8Array(await audioFile.arrayBuffer());
    const ext = audioFile.type.includes('mp4') ? 'm4a' : 'webm';
    const contentType = audioFile.type || 'audio/webm';
    const audioPath = `replies/${activityId}/${crypto.randomUUID()}.${ext}`;

    const supabase = createClient(supabaseUrl, serviceKey);
    const { error: uploadError } = await supabase.storage
      .from('audio-reflections')
      .upload(audioPath, audioBytes, { contentType, upsert: true });
    if (uploadError) console.error('Storage upload failed:', uploadError.message);

    // 2. Transcribe with Groq Whisper
    const groqForm = new FormData();
    groqForm.append('file', new Blob([audioBytes], { type: contentType }), `audio.${ext}`);
    groqForm.append('model', 'whisper-large-v3-turbo');
    groqForm.append('response_format', 'json');

    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}` },
      body: groqForm,
    });
    if (!groqRes.ok) throw new Error(`Groq error: ${await groqRes.text()}`);
    const { text: transcript } = await groqRes.json();

    // 3. Store as a reply row
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/reflection_replies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        session_id: sessionId,
        reflection_ref: reflectionRef,
        activity_id: activityId,
        reply_text: transcript,
        kind: 'voice',
        audio_path: audioPath,
      }),
    });
    if (!dbRes.ok) console.error('DB insert failed:', await dbRes.text());

    return new Response(JSON.stringify({ transcript }), {
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
