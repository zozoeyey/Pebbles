// Ranks SEL activities for a specific child using Claude, based on the parent's
// onboarding answers (child age + the challenges they described).
//
// Deploy:  supabase functions deploy suggest-activities
// Secret:  ANTHROPIC_API_KEY (already set for process-reflection)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ActivityIn {
  id: string;
  title: string;
  skills?: string[];
  ages?: string;
  desc?: string;
  time?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      childAge = null,
      challenges = [],
      customText = '',
      selDefinition = '',
      emotionHandling = '',
      activities = [],
      count = 2,
    } = (await req.json()) as {
      childAge: number | null;
      challenges: string[];
      customText: string;
      selDefinition?: string;
      emotionHandling?: string;
      activities: ActivityIn[];
      count?: number;
    };

    if (!Array.isArray(activities) || activities.length === 0) {
      return new Response(JSON.stringify({ error: 'no activities provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!;

    const validIds = new Set(activities.map((a) => a.id));
    const wantN = Math.min(Math.max(1, count), activities.length);

    const challengeText = [
      ...challenges,
      ...(customText.trim() ? [`(in their words) "${customText.trim()}"`] : []),
    ].join('; ') || 'none specified';

    const catalog = activities
      .map(
        (a) =>
          `- id: ${a.id}\n  title: ${a.title}\n  skills: ${(a.skills ?? []).join(', ')}\n  ages: ${a.ages ?? ''}\n  duration: ${a.time ?? ''}\n  about: ${a.desc ?? ''}`,
      )
      .join('\n');

    const parentContext = [
      selDefinition.trim() ? `How the parent describes SEL (gauges their familiarity): "${selDefinition.trim()}"` : '',
      emotionHandling.trim() ? `How the parent currently handles big emotions: "${emotionHandling.trim()}"` : '',
    ].filter(Boolean).join('\n');

    // Keep in sync with docs/suggestion-rubric.md
    const rubric =
      `Selection rubric, in priority order:\n` +
      `1. AGE FIT (hard rule): only pick activities whose age range includes the child's age, ` +
      `or is at most 1 year off. Unknown age: prefer broad ranges.\n` +
      `2. CHALLENGE MATCH: map the challenge to skills — trouble naming feelings → Identifying emotions; ` +
      `big reactions / meltdowns → Self-regulation + Interoception; tantrums during transitions → Self-regulation; ` +
      `hard to calm down → Interoception + Self-regulation; low confidence / gives up easily → activities about ` +
      `rolling with mistakes (Self-regulation) or recognizing feelings behind self-doubt (Identifying emotions).\n` +
      `3. PARENT READINESS: if the parent seems new to SEL or describes only distraction/discipline for big ` +
      `emotions, start with short, playful, in-the-moment activities (breathing, movement games). If they already ` +
      `name feelings together, step up to reflective ones (temperature check, mood diary, feelings circle).\n` +
      `4. DIVERSITY: the ${wantN} picks should not share the same primary skill — ideally pair one ` +
      `"calm down right now" tool with one "build the skill over time" practice.\n` +
      `5. ATTENTION SPAN: for ages 5 and under, prefer activities of 10 minutes or less.`;

    const prompt =
      `You are helping a parent choose social-emotional learning (SEL) activities for their child.\n\n` +
      `Child's age: ${childAge ?? 'unknown'}\n` +
      `What the parent says is hard right now: ${challengeText}\n` +
      (parentContext ? `${parentContext}\n` : '') +
      `\nAvailable activities:\n${catalog}\n\n${rubric}\n\n` +
      `Choose the ${wantN} activities that best fit THIS child, following the rubric. ` +
      `For each, write one warm, specific sentence (max ~20 words) telling the parent why it fits — ` +
      `reference their child's situation, not generic benefits. Rank best first. ` +
      `Only choose from the activity ids listed above.`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        tools: [
          {
            name: 'return_suggestions',
            description: 'Return the ranked activity suggestions for this child.',
            input_schema: {
              type: 'object',
              properties: {
                suggestions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', description: 'the activity id, exactly as given' },
                      reason: { type: 'string', description: 'one warm, specific sentence for the parent' },
                    },
                    required: ['id', 'reason'],
                  },
                },
              },
              required: ['suggestions'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'return_suggestions' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) throw new Error(`Claude error: ${await claudeRes.text()}`);
    const data = await claudeRes.json();
    const toolUse = (data.content ?? []).find((c: { type: string }) => c.type === 'tool_use');
    const raw = (toolUse?.input?.suggestions ?? []) as { id: string; reason: string }[];

    // Keep only valid, unique ids, capped at wantN.
    const seen = new Set<string>();
    const suggested = raw
      .filter((s) => validIds.has(s.id) && !seen.has(s.id) && seen.add(s.id))
      .slice(0, wantN);

    return new Response(JSON.stringify({ suggested }), {
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
