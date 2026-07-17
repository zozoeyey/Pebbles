import type { Activity, ExploreAct, CommunityReflection, PeerReflection, ActConfig } from '../types';

export const EXPLORE_ACTS: ExploreAct[] = [
  {
    id: 'freeze-feelings',
    title: 'Freeze Feelings: An SEL Kernels Brain Game',
    time: '15 mins',
    skills: ['Impulse control', 'Interoception'],
    timeVal: '10to20',
    ages: 'Ages 3–7',
    refs: '18 reflections',
    desc: 'Kids move around and freeze when an emotion is called out — a playful way to connect movement with feeling words.',
    detailDesc:
      'Kids move around freely, and when an emotion is called out, they freeze in a pose that represents that feeling — a playful way to connect movement with feeling words.',
    materials: ['Music to dance to (any upbeat songs work!)'],
    tip: 'Model each feeling yourself, especially for younger children — exaggerate your facial expressions and body pose to help them understand.',
    url: 'https://ggie.berkeley.edu/practice/freeze-feelings-an-sel-kernels-brain-game/#tab__2',
    videoUrl: 'assets/Impulse-Control.mp4',
    videoThumb: 'assets/impulse control open.svg',
    videoTitle: 'Impulse Control',
    videoDesc:
      'Impulse control is the ability to pause between feeling an urge and acting on it. That tiny pause is what lets kids stop, think, and choose — and like a muscle, it grows with playful practice.',
    whenHelps:
      'Good when your child has lots of energy or finds it hard to stop and pause — a playful way to practice catching a feeling and showing it.',
    olderKids:
      'Let older kids (7+) run the game: they call out the feelings, pick subtler ones like disappointed, proud, or nervous, and you guess each other\'s frozen poses instead of announcing them.',
  },
  {
    id: 'emotion-charades',
    title: 'Emotion Charades',
    time: '15 mins',
    skills: ['Identifying emotions'],
    timeVal: '10to20',
    ages: 'Ages 3–9',
    refs: '12 reflections',
    desc: 'Kids take turns acting out emotions for others to guess — a fun, active way to recognize and name feelings.',
    detailDesc:
      'Kids draw a feeling from a bowl and act it out using only their face and body while the other player guesses. Reading each other\'s expressions — and talking about the clues afterward — builds the vocabulary kids need to recognize and name emotions in themselves and others.',
    materials: ['Slips of paper', 'A pen or marker', 'A bowl or hat to draw from'],
    tip: 'Start with big, easy emotions like happy and angry, and exaggerate your own turns. Save trickier feelings like jealous or nervous for once they\'re warmed up.',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/recognizing/emotion-charades/',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Guessing a feeling from a face or a pose is exactly how kids learn to read emotions in real life. This quick intro shows why naming feelings is such a powerful skill to practice.',
    whenHelps:
      'Great for a child who struggles to find words for feelings — acting them out first makes naming them feel like play, not pressure.',
    olderKids:
      'For older kids, add subtler feelings (embarrassed, jealous, proud) and short scenarios — "nervous before a test" — and have the guesser explain which clues gave it away.',
  },
  {
    id: 'tense-and-relax',
    title: 'Tense and Relax',
    time: '10 mins',
    skills: ['Interoception'],
    timeVal: '10to20',
    ages: 'Ages 3–9',
    refs: '18 reflections',
    desc: 'Kids squeeze and release different muscle groups to feel the difference between tension and calm in their bodies.',
    detailDesc:
      'Kids squeeze and release different muscle groups to feel the contrast between tension and calm — a simple, effective technique for building body awareness and self-regulation.',
    materials: ['A quiet space', 'Optional: soft background music'],
    tip: "Go slowly and breathe deeply together. The contrast between tense and relaxed is the key learning moment — don't rush through it.",
    url: 'https://smho-smso.ca/emhc/stress-management-and-coping/stretching/tense-and-relax/',
    videoUrl: 'assets/Interoception.mp4',
    videoThumb: 'assets/it open.svg',
    videoTitle: 'Interoception',
    videoDesc:
      "Interoception is the sense of what's happening inside your body — a racing heart, tight shoulders, butterflies in the tummy. Kids who can read those signals catch big feelings early, which is the first step to calming them.",
    olderKids:
      'Older kids can skip the animal imagery: hold each squeeze a little longer, then do a slow head-to-toe body scan and name exactly where they feel tightness when stressed.',
  },
  {
    id: 'whats-my-temperature',
    title: "What's My Temperature?",
    time: '15 mins',
    skills: ['Identifying emotions'],
    timeVal: '10to20',
    ages: 'Ages 5–10',
    refs: '14 reflections',
    desc: "Kids use a thermometer metaphor to rate how 'hot' or 'cool' they feel — a simple way to notice and name the intensity of an emotion.",
    detailDesc:
      'Kids picture their feelings on a thermometer — cool and calm at the bottom, hot and overwhelmed at the top — then point to where they are right now. It gives them a shared language for how strong a feeling is, not just what it is.',
    materials: ['A printed or hand-drawn thermometer', 'Markers or crayons'],
    tip: "Share your own temperature first ('I'm feeling like a 7 — a little frazzled'). Naming your own intensity out loud makes it safe for them to do the same.",
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/gauging/whats-my-temperature/',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Naming a feeling is step one — naming how BIG it is comes next. This quick intro shows why putting words (and numbers) on emotions gives kids power over them.',
    whenHelps:
      'Useful when your child feels things intensely but struggles to explain how much — a quick check-in they can use anywhere.',
    olderKids:
      'Older kids can switch to a 0–10 scale, check their temperature at a few set points in the day, and start spotting what pushes it up — then pick a go-to cool-down for their hottest moments.',
  },
  {
    id: 'wiggle-cool-down',
    title: 'Wiggle Cool Down: An SEL Kernels Brain Game',
    time: '5 mins',
    skills: ['Impulse control'],
    timeVal: 'under10',
    ages: 'Ages 3–7',
    refs: '9 reflections',
    desc: 'Kids shake out extra energy, then follow a short sequence of calming moves to settle their bodies and brains and get ready to focus.',
    detailDesc:
      'Kids move through a repeating sequence — wiggle, get quiet, sit silently, breathe deeply, roll shoulders back — practicing each move one at a time. Remembering the order builds attention while the moves release energy and bring the body back to calm.',
    materials: ['Just a bit of open space to move'],
    tip: 'Do every move alongside them and keep it playful. Younger kids may need to practice each step on its own before stringing them together.',
    url: 'https://ggie.berkeley.edu/practice/wiggle-cool-down-an-sel-kernels-brain-game/',
    videoUrl: 'assets/Impulse-Control.mp4',
    videoThumb: 'assets/impulse control open.svg',
    videoTitle: 'Impulse Control',
    videoDesc:
      'Impulse control is the ability to pause between feeling an urge and acting on it. That tiny pause is what lets kids stop, think, and choose — and like a muscle, it grows with playful practice.',
    whenHelps:
      'Great before a transition or when energy is running high and it is hard to settle down.',
    olderKids:
      'Older kids can lead the sequence themselves, invent and add extra steps, or try to remember a longer chain of moves each round — the memory challenge is the point.',
  },
  {
    id: 'musical-drawings',
    title: 'Musical Drawings: Turning Mistakes into Art',
    time: '25 mins',
    skills: ['Identifying emotions'],
    timeVal: '20to30',
    ages: 'Ages 5–10',
    refs: '6 reflections',
    desc: 'Kids draw freely to music and turn any "mistake" line into part of the picture — a playful way to practice staying calm and flexible when things do not go as planned.',
    detailDesc:
      'As music plays, kids let their marker follow the sound. When a line goes "wrong," instead of erasing it they fold it into the drawing. Reframing mistakes as something they can work with builds emotional flexibility and a calmer response to frustration.',
    materials: ['Paper', 'Markers or crayons', 'A few songs with different moods'],
    tip: 'Model it yourself — make an obvious "oops" mark and turn it into something on purpose. Focus on expression and reflection, not on making it look perfect.',
    url: 'https://www.eduref.org/lessons/interdisciplinary/int0091',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Frustration at a "mistake" is a feeling kids can learn to spot and name mid-moment. This quick intro shows how naming emotions — like the ones music and mess-ups stir up — takes away their sting.',
    whenHelps:
      'Good for a child who gets frustrated or gives up when things are not perfect — a low-stakes way to practice rolling with it.',
    olderKids:
      'After drawing, older kids can reflect: how did each song change their lines? Have them title the piece, then connect it to a real "oops" from their week they could reframe the same way.',
  },
  {
    id: 'balloon-breathing',
    title: 'Balloon Breathing',
    time: '5 mins',
    skills: ['Interoception', 'Impulse control'],
    timeVal: 'under10',
    ages: 'Ages 3–8',
    refs: '8 reflections',
    desc: 'Kids breathe in slowly to fill their belly like a balloon, then let it deflate — a simple way to feel what a deep, calming breath is like.',
    detailDesc:
      'Kids place their hands on their belly and imagine it as a balloon: a slow breath in through the nose inflates it, a slow breath out lets it gently deflate. Feeling the belly rise and fall teaches them what a truly deep breath feels like — the foundation of every calming technique.',
    materials: ['A comfy place to sit or lie down'],
    tip: 'Lying down with a stuffed animal on the belly makes the "balloon" visible — kids can watch it ride up and down as they breathe.',
    olderKids:
      'Older kids can add a count — in for 4, hold for 2, out for 6 — and compare one hand on the chest with one on the belly to check the breath is really going deep.',
    url: 'https://copingskillsforkids.com/deep-breathing-exercises-for-kids',
    videoUrl: 'assets/Interoception.mp4',
    videoThumb: 'assets/it open.svg',
    videoTitle: 'Interoception',
    videoDesc:
      "Interoception is the sense of what's happening inside your body — a racing heart, tight shoulders, butterflies in the tummy. Kids who can read those signals catch big feelings early, which is the first step to calming them.",
    whenHelps:
      'A go-to reset before bed, after a meltdown, or any time your child needs a quick, quiet way to settle their body.',
  },
  {
    id: 'flower-breathing',
    title: 'Flower Breathing',
    time: '5 mins',
    skills: ['Interoception', 'Impulse control'],
    timeVal: 'under10',
    ages: 'Ages 3–7',
    refs: '7 reflections',
    desc: 'Kids imagine smelling a flower — a slow breath in through the nose, then a soft sigh out — turning deep breathing into pretend play.',
    detailDesc:
      'Kids picture holding a favorite flower: they breathe in slowly through the nose to "smell" it, pause a moment, then let the breath go with a soft sigh. The pretend play makes slow nose-breathing feel natural for even the youngest kids.',
    materials: ['Nothing needed — a real flower is a fun bonus'],
    tip: 'Pair it with "blow out the candle": smell the flower in one hand, then slowly blow out the pretend candle in the other. The pairing makes the exhale as long as the inhale.',
    olderKids:
      'Older kids can drop the pretend play and focus on the noticing: what does the breath feel like in the nose, the chest, the belly? Where does the calm show up first?',
    url: 'https://copingskillsforkids.com/deep-breathing-exercises-for-kids',
    videoUrl: 'assets/Interoception.mp4',
    videoThumb: 'assets/it open.svg',
    videoTitle: 'Interoception',
    videoDesc:
      "Interoception is the sense of what's happening inside your body — a racing heart, tight shoulders, butterflies in the tummy. Kids who can read those signals catch big feelings early, which is the first step to calming them.",
    whenHelps:
      'Perfect for younger kids who find "take a deep breath" too abstract — pretending to smell a flower gets the same slow breath without instructions.',
  },
  {
    id: 'bubble-breathing',
    title: 'Bubble Breathing',
    time: '5 mins',
    skills: ['Impulse control', 'Interoception'],
    timeVal: 'under10',
    ages: 'Ages 3–8',
    refs: '5 reflections',
    desc: 'Kids blow real or imaginary bubbles with a slow, steady breath — blow too hard and the bubble pops, so gentle wins.',
    detailDesc:
      'Kids blow bubbles — real ones or pretend — and discover that only a slow, gentle, steady breath makes a big bubble; a fast, hard puff just pops it. It turns breath control into a game with instant feedback, sneaking impulse control practice into play.',
    materials: ['A bottle of bubbles (or just imagination)'],
    tip: 'Narrate the discovery instead of instructing: "Whoa, what happened when you blew fast? What if you try really slow?" Let the bubbles do the teaching.',
    olderKids:
      'Challenge older kids to blow the biggest bubble they can, then use that same slow exhale without the wand — eyes closed, imagining the bubble growing — as a calm-down they can use anywhere.',
    url: 'https://copingskillsforkids.com/deep-breathing-exercises-for-kids',
    videoUrl: 'assets/Impulse-Control.mp4',
    videoThumb: 'assets/impulse control open.svg',
    videoTitle: 'Impulse Control',
    videoDesc:
      'Impulse control is the ability to pause between feeling an urge and acting on it. That tiny pause is what lets kids stop, think, and choose — and like a muscle, it grows with playful practice.',
    whenHelps:
      'Great for kids who rush or blow up quickly — the bubble gives instant, playful feedback that slow and gentle works better.',
  },
  {
    id: 'feelings-circle',
    title: 'Feelings Circle',
    time: '10 mins',
    skills: ['Identifying emotions'],
    timeVal: '10to20',
    ages: 'Ages 3–8',
    refs: '10 reflections',
    desc: 'A simple check-in ritual where everyone takes a turn sharing how they feel — building the habit of naming emotions out loud.',
    detailDesc:
      'The family sits in a circle and takes turns answering "How are you feeling right now?" — with words, faces, or by pointing at feeling pictures for the youngest. Done regularly (at dinner, before bed), it makes talking about emotions as normal as talking about the day.',
    materials: ['Optional: feeling faces printed or drawn on cards for younger kids'],
    tip: 'Always take a real turn yourself — "I felt frustrated in traffic today" teaches more than any prompt. There are no wrong answers, and passing is allowed.',
    olderKids:
      'Older kids can add the why ("I feel proud because…"), stretch for more precise words (annoyed vs. furious, nervous vs. excited), and notice how a feeling changed over the day.',
    url: 'https://ggie.berkeley.edu/practice/feelings-circle-for-kindergarten-sel-kernel/#tab__2',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'A daily feelings check-in is the simplest way to grow emotional vocabulary. This quick intro shows why naming feelings out loud matters so much.',
    whenHelps:
      'Ideal as a daily ritual — especially for families where feelings only come up during meltdowns. This makes them everyday conversation instead.',
  },
  {
    id: 'emotion-portraits',
    title: 'Emotion Portraits',
    time: '25 mins',
    skills: ['Identifying emotions'],
    timeVal: '20to30',
    ages: 'Ages 5–9',
    refs: '6 reflections',
    desc: 'Kids draw faces showing different emotions, then talk about what makes each expression unique.',
    detailDesc:
      'Kids draw a set of faces — happy, sad, angry, surprised, scared — and study what changes between them: the eyebrows, the mouth, the eyes. Drawing the details of each expression trains them to spot those same clues on real faces, including their own in the mirror.',
    materials: ['Paper', 'Markers, crayons, or pencils', 'Optional: a small mirror'],
    tip: 'Make the expression in a mirror together before drawing it — "What are your eyebrows doing when you\'re angry?" The noticing matters more than the drawing.',
    olderKids:
      'Older kids can draw trickier blends — nervous-but-excited, disappointed-but-okay — and add a comic-strip panel showing what happened right before the face.',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/recognizing/emotion-portraits/',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Reading a face is a skill, and drawing faces is sneaky-good practice. This quick intro shows how recognizing expressions helps kids name their own feelings.',
    whenHelps:
      'Great for kids who love to draw, or who can name feelings in stories but miss the cues on real faces.',
  },
  {
    id: 'mood-diary',
    title: 'Mood Diary',
    time: '5 mins a day',
    skills: ['Identifying emotions', 'Interoception'],
    timeVal: 'under10',
    ages: 'Ages 7–11',
    refs: '5 reflections',
    desc: 'Kids track their moods each day in a simple journal, spotting patterns in how and why their feelings change.',
    detailDesc:
      'Each day, kids jot down (or draw) their strongest feeling, what was happening, and where they felt it in their body. Over a week or two, patterns appear — "I\'m always grumpy before dinner" — and spotting the pattern is the first step to getting ahead of it.',
    materials: ['A notebook or printed template', 'Pens or markers'],
    tip: 'Keep entries tiny — one feeling, one sentence, one body clue. Review the week together on weekends like detectives hunting for patterns, never like checking homework.',
    olderKids:
      'This one already suits older kids best. Kids 9+ can rate intensity 1–10, track more than one feeling a day, and write what they tried when a big feeling hit — and whether it helped.',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/understanding/mood-diary/',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Naming a feeling in the moment is step one; noticing your patterns over time is the superpower. This quick intro covers the naming skill the diary builds on.',
    whenHelps:
      'Best for older kids whose big feelings seem to come out of nowhere — the diary turns "nowhere" into patterns you can both see coming.',
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'freeze-feelings',
    title: 'Freeze Feelings: An SEL Kernels Brain Game',
    description:
      'Kids move around and freeze when an emotion is called out — a playful way to connect movement with feeling words.',
    grades: ['K'],
    type: 'Full lesson',
    source: "UC Berkeley's Greater Good Science Center",
    url: 'https://ggie.berkeley.edu/practice/freeze-feelings-an-sel-kernels-brain-game/#tab__2',
    skills: ['Identifying emotions'],
    time: '~20 min',
    timeBucket: '20to30',
    content: null,
  },
  {
    id: 'feelings-circle-k',
    title: 'Feelings Circle for Kindergarten',
    description:
      'A short group routine where kids share how they\'re feeling using simple emotion words and pictures.',
    grades: ['K'],
    type: 'Full lesson',
    source: "UC Berkeley's Greater Good Science Center",
    url: 'https://ggie.berkeley.edu/practice/feelings-circle-for-kindergarten-sel-kernel/#tab__2',
    skills: ['Identifying emotions'],
    time: '~30 min',
    timeBucket: '30plus',
    content: null,
  },
  {
    id: 'emotional-intelligence-playbook',
    title: 'Emotional Intelligence Playbook',
    description:
      'A research-backed guide with simple at-home strategies for helping kids understand and manage their emotions.',
    grades: ['K', '1', '2', '3'],
    type: 'Artifact',
    source: 'Character Lab',
    url: 'https://characterlab.org/playbooks/emotional-intelligence/',
    skills: ['Identifying emotions', 'Self-efficacy'],
    time: '~10 min',
    timeBucket: '10to20',
    content: null,
  },
  {
    id: 'whats-my-temperature',
    title: "What's My Temperature?",
    description:
      "Kids use a thermometer metaphor to rate and communicate how 'hot' or 'cool' they feel emotionally in the moment.",
    grades: ['K', '1', '2', '3'],
    type: 'Full lesson',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/gauging/whats-my-temperature/',
    skills: ['Accurate self-perception'],
    time: '~20 min',
    timeBucket: '20to30',
    content: null,
  },
  {
    id: 'emotion-charades',
    title: 'Emotion Charades',
    description:
      'Kids take turns acting out emotions for others to guess — a fun, active way to recognize and name feelings.',
    grades: ['K', '1', '2', '3'],
    type: 'Full lesson',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/recognizing/emotion-charades/',
    skills: ['Identifying emotions'],
    time: '~20 min',
    timeBucket: '20to30',
    content: null,
  },
  {
    id: 'emotion-portraits',
    title: 'Emotion Portraits',
    description:
      'Kids draw faces showing different emotions, then talk about what makes each expression unique.',
    grades: ['K', '1', '2', '3'],
    type: 'Full lesson',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/recognizing/emotion-portraits/',
    skills: ['Identifying emotions'],
    time: '~25 min',
    timeBucket: '20to30',
    content: null,
  },
  {
    id: 'mood-diary',
    title: 'Mood Diary',
    description:
      'Kids track their moods daily in a simple journal, helping them spot patterns in how and why they feel different things.',
    grades: ['K', '1', '2', '3'],
    type: 'Full lesson',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/identification-and-management-of-emotions/understanding/mood-diary/',
    skills: ['Identifying emotions', 'Accurate self-perception'],
    time: '~20 min',
    timeBucket: '20to30',
    content: null,
  },
  {
    id: 'self-awareness-card',
    title: 'Self-Awareness and Advocacy Card',
    description:
      'Kids fill out a card about their strengths, challenges, and what kind of support helps them most.',
    grades: ['3'],
    type: 'Practice',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/self-awareness-and-sense-of-identity/assertive-communication/self-advocacy-cards/',
    skills: ['Accurate self-perception', 'Recognizing strengths', 'Self-confidence', 'Self-efficacy'],
    time: '~15 min',
    timeBucket: '10to20',
    content: null,
  },
  {
    id: 'tense-and-relax',
    title: 'Tense and Relax',
    description:
      'Kids squeeze and release different muscle groups to feel the difference between tension and calm in their bodies.',
    grades: ['K', '1', '2', '3'],
    type: 'Practice',
    source: 'Everyday Mental Health Classroom Resource',
    url: 'https://smho-smso.ca/emhc/stress-management-and-coping/stretching/tense-and-relax/',
    skills: ['Identifying emotions'],
    time: '~10 min',
    timeBucket: '10to20',
    content: null,
  },
];

export const COMMUNITY_REFLECTIONS: Record<string, CommunityReflection[]> = {
  'freeze-feelings': [
    {
      age: 8,
      time: '2h ago',
      bg: '#fdd15e',
      charFill: '#9CD3F8',
      text: "The activity created space for more open conversation than usual, with the child sharing feelings they typically don't express—showing how intentional slowing down unlocked emotional sharing.",
      likes: 24,
    },
    {
      age: 6,
      time: '5h ago',
      bg: '#d6e475',
      charFill: '#F9A3C4',
      text: "We did this right after school and it turned into one of the most connected moments we've had in a while. My daughter was shy about acting out 'embarrassed' but ended up laughing and really got into it.",
      likes: 17,
    },
    {
      age: 5,
      time: '1d ago',
      bg: '#F9A3C4',
      charFill: '#FDD15E',
      text: "Tried the Tense and Relax activity with Lara while she was distracted and hyperactive — went ahead anyway despite the bad timing. What went well: the imagery made her giggle, and she noticed on her own that her hands felt 'floppy' afterward.",
      likes: 11,
    },
  ],
  'emotional-intelligence-playbook': [
    {
      age: 7,
      time: '2h ago',
      bg: '#d6e475',
      charFill: '#F9A3C4',
      text: 'Maya was able to name basic emotions easily and even added her own ("frustrated" when things don\'t go her way); she seemed especially engaged when we connected the scenario to something that actually happened at school.',
      likes: 18,
    },
    {
      age: 9,
      time: '5h ago',
      bg: '#fdd15e',
      charFill: '#9CD3F8',
      text: "I jumped in too quickly to label the 'right' emotion instead of letting her sit with it. Next time I want to give more space for her to explore her own interpretations, and focus less on getting the 'right' answer.",
      likes: 7,
    },
    {
      age: 8,
      time: '2d ago',
      bg: '#9CD3F8',
      charFill: '#FDD15E',
      text: 'Tried this with Marcus at the kitchen table using index cards and markers. He was engaged and excited to decorate; the prompt about how others can tell when he\'s not doing well led to a surprisingly insightful response.',
      likes: 13,
    },
  ],
};

export const PEER_REFLECTIONS: Record<string, PeerReflection> = {
  'freeze-feelings': {
    paragraphs: [
      'Tried the Freeze Feelings activity with Lara (5) while she was distracted and hyperactive — went ahead anyway despite the bad timing.',
      'What went well: the imagery made her giggle, and she noticed on her own that her hands felt "floppy" afterward.',
      "What could have gone better: got frustrated when she squirmed, tightened up myself (ironically) — recognized she was just being five, and the calm moment was on my schedule, not hers.",
      'Hope for the future: keep trying the activity and get better at it over time.',
    ],
    attribution: 'Parent of a 5-year-old',
  },
  'tense-and-relax': {
    paragraphs: [
      'Activity engagement: Caleb enjoyed the push-pull-drop activity and found the steps easy to follow, though he took the "push feet into the floor" instruction very literally and needed clarification on its meaning.',
      'Focus on mechanics over sensation: Caleb concentrated on completing the physical actions correctly rather than noticing the difference between tense and relaxed muscles—a common developmental stage for young learners.',
      'Key takeaway: Keeping the activity light and playful, rather than aiming for perfect execution, helps children engage more fully and reduces pressure for both parent and child.',
    ],
    attribution: 'Parent of a 6-year-old',
  },
  'self-awareness-card': {
    paragraphs: [
      'Tried the Self-Advocacy Cards with Marcus (8) at the kitchen table using index cards and markers — kept it simple and one-on-one.',
      'What went well: Marcus was engaged and excited to decorate; the prompt about how others can tell when he\'s not doing well led to a surprisingly insightful response ("I get really quiet, but also my voice gets louder").',
      'What could have gone better: moved through the questions too quickly, treating it more like an interview; redirected him when he wandered into stories that may have actually held important insights.',
      'Hope for the future: slow down, allow more silence, and treat his tangents (like stories about recess) as part of the process rather than distractions.',
    ],
    attribution: 'Parent of an 8-year-old',
  },
  'emotional-intelligence-playbook': {
    paragraphs: [
      'Tried a short emotional intelligence activity with Maya (7) during a quiet moment after dinner — used a simple scenario to talk about feelings and reactions.',
      'What went well: Maya was able to name basic emotions easily and even added her own ("frustrated" when things don\'t go her way); she seemed especially engaged when we connected the scenario to something that actually happened at school.',
      "What could have gone better: I jumped in too quickly to label the \"right\" emotion instead of letting her sit with it; I also tried to correct her when her answer didn't match what I expected, which slowed her down.",
      'Hope for the future: give her more space to explore her own interpretations of feelings, and focus less on getting the "right" answer and more on the conversation itself.',
    ],
    attribution: 'Parent of a 7-year-old',
  },
};

export const ACT_CONFIGS: Record<string, ActConfig> = {
  'freeze-feelings': {
    title: 'Freeze Feelings',
    audioSrc: 'assets/freeze feeling.mp3',
    steps: [
      'Clear a space where your child can move without bumping into things.',
      'Before each round, announce a feeling — happy, sad, angry, scared, embarrassed, etc.',
      'Give them a moment to think about how they\'d show that emotion with their face and body.',
      'Start the music and let them dance freely.',
      'Stop the music — they freeze in a pose that shows the emotion.',
      'Play multiple rounds with different feelings.',
    ],
    stepTimes: [0, 6.5, 16.5, 24.0, 28.0, 33.5],
    stepImgs: [
      'assets/steps/freeze-feelings-1.svg',
      'assets/steps/freeze-feelings-2.svg',
      'assets/steps/freeze-feelings-3.svg',
      'assets/steps/freeze-feelings-4.svg',
      'assets/steps/freeze-feelings-5.svg',
      'assets/steps/freeze-feelings-6.svg',
    ],
  },
  'tense-and-relax': {
    title: 'Tense and Relax',
    audioSrc: 'assets/Tense & Relax.mp3',
    steps: [
      'Neck (Turtle): Push shoulders up toward ears, hold for 3 counts, then slowly relax for 3 counts. Repeat.',
      'Hands (Lemon): Squeeze hands into tight fists, hold for 3 counts, then slowly open and relax. Repeat.',
      'Stomach (Fence): Squeeze your belly in like you\'re squeezing through a narrow fence, hold for 3 counts, then relax. Repeat.',
      'Feet (Mud): Push feet down into the floor, hold for 3 counts, then slowly relax. Repeat.',
      'Arms (Push-Pull-Drop): Sitting in a chair, grip the edges. First push down, then pull up against the seat, then drop your arms to your sides. Repeat.',
      "Between each exercise, ask: 'How does that body part feel now compared to when it was tight?'",
    ],
    stepTimes: [0, 10.0, 21.4, 36.4, 44.5, 53.4],
    stepImgs: [
      'assets/turtle.gif',
      'assets/lemon.gif',
      'assets/steps/tense-and-relax-3.svg',
      'assets/steps/tense-and-relax-4.svg',
      'assets/steps/tense-and-relax-5.svg',
      'assets/steps/tense-and-relax-6.svg',
    ],
  },
  'emotion-charades': {
    title: 'Emotion Charades',
    steps: [
      'Write feeling words (or draw simple faces) on slips of paper — happy, sad, angry, scared, surprised, excited — and drop them in a bowl.',
      'Take turns drawing a slip without showing anyone.',
      'Act out the feeling using only your face and body — no words or sounds allowed!',
      'The other player guesses the feeling. Close guesses count — the goal is talking about feelings, not winning.',
      "After each round, chat about it: what clues gave it away? When have you felt that way?",
      'Swap roles and keep going — add trickier feelings like proud, jealous, or nervous as you warm up.',
    ],
    stepImgs: [
      'assets/steps/emotion-charades-1.svg',
      'assets/steps/emotion-charades-2.svg',
      'assets/steps/emotion-charades-3.svg',
      'assets/steps/emotion-charades-4.svg',
      'assets/steps/emotion-charades-5.svg',
      'assets/steps/emotion-charades-6.svg',
    ],
  },
  'whats-my-temperature': {
    title: "What's My Temperature?",
    steps: [
      'Draw a thermometer together — cool blue at the bottom, warm red at the top.',
      'Cool means calm and relaxed. Hot means a big, strong feeling.',
      'Ask your child: where are you on the thermometer right now?',
      "Talk about it — what's making you feel that way? Name the feeling together.",
      'Feeling hot? Pick one way to cool down: a few deep breaths, a stretch, or a quiet break.',
      'Check the thermometer again. Did your temperature change?',
    ],
    stepImgs: [
      'assets/steps/whats-my-temperature-1.svg',
      'assets/steps/whats-my-temperature-2.svg',
      'assets/steps/whats-my-temperature-3.svg',
      'assets/steps/whats-my-temperature-4.svg',
      'assets/steps/whats-my-temperature-5.svg',
      'assets/steps/whats-my-temperature-6.svg',
    ],
  },
  'wiggle-cool-down': {
    title: 'Wiggle Cool Down',
    steps: [
      'Find some open space where you can both move freely.',
      'Wiggle it out — shake your arms, legs, and whole body for a few seconds.',
      'Now get quiet — slow your body down and let the wiggles fade away.',
      'Sit silently and still, with your hands resting in your lap.',
      'Take a few slow, deep breaths — in through your nose, out through your mouth.',
      'Roll your shoulders back and notice how calm and ready your body feels now.',
    ],
    stepImgs: [
      'assets/steps/wiggle-cool-down-1.svg',
      'assets/steps/wiggle-cool-down-2.svg',
      'assets/steps/wiggle-cool-down-3.svg',
      'assets/steps/wiggle-cool-down-4.svg',
      'assets/steps/wiggle-cool-down-5.svg',
      'assets/steps/wiggle-cool-down-6.svg',
    ],
  },
  'balloon-breathing': {
    title: 'Balloon Breathing',
    steps: [
      'Sit comfortably or lie down, and place both hands gently on your belly.',
      'Imagine your belly is a balloon in your favorite color.',
      'Breathe in slowly through your nose and feel the balloon fill up — hands rising.',
      'Pause for a moment at the top. The balloon is full!',
      'Breathe out slowly through your mouth and feel the balloon gently deflate.',
      'Repeat 5 times. Notice how your body feels when the balloon is soft and empty.',
    ],
    stepImgs: [
      'assets/steps/balloon-breathing-1.svg',
      'assets/steps/balloon-breathing-2.svg',
      'assets/steps/balloon-breathing-3.svg',
      'assets/steps/balloon-breathing-4.svg',
      'assets/steps/balloon-breathing-5.svg',
      'assets/steps/balloon-breathing-6.svg',
    ],
  },
  'flower-breathing': {
    title: 'Flower Breathing',
    steps: [
      'Sit together somewhere comfy and imagine holding a beautiful flower.',
      'What flower is it? What color? Let your child describe it.',
      'Bring the flower up to your nose and smell it — a slow, deep breath in through your nose.',
      'Pause a moment to enjoy the smell.',
      'Let the breath out with a soft, happy sigh — ahhh.',
      'Smell the flower 5 more times, slower each time. Notice how your body softens.',
    ],
    stepImgs: [
      'assets/steps/flower-breathing-1.svg',
      'assets/steps/flower-breathing-2.svg',
      'assets/steps/flower-breathing-3.svg',
      'assets/steps/flower-breathing-4.svg',
      'assets/steps/flower-breathing-5.svg',
      'assets/steps/flower-breathing-6.svg',
    ],
  },
  'bubble-breathing': {
    title: 'Bubble Breathing',
    steps: [
      'Grab your bubbles and find a good spot — outside or over a towel works well.',
      'First, let them blow however they want. Watch what happens with fast, hard puffs!',
      'Now try it slow: take a deep breath in through your nose.',
      'Blow out slowly, gently, and steadily — watch the bubble grow big.',
      'Talk about it: which breath made the best bubbles? Fast or slow?',
      'Finish with 3 pretend bubbles — same slow breath, no wand. That\'s your calm-down breath!',
    ],
    stepImgs: [
      'assets/steps/bubble-breathing-1.svg',
      'assets/steps/bubble-breathing-2.svg',
      'assets/steps/bubble-breathing-3.svg',
      'assets/steps/bubble-breathing-4.svg',
      'assets/steps/bubble-breathing-5.svg',
      'assets/steps/bubble-breathing-6.svg',
    ],
  },
  'feelings-circle': {
    title: 'Feelings Circle',
    steps: [
      'Sit in a circle (or around the table) where everyone can see each other.',
      'Explain the one rule: everyone gets a turn, all feelings are okay, and passing is allowed.',
      'Go around: "How are you feeling right now?" Little ones can point to a feeling face or show it with their own face.',
      'Take your own turn honestly — share a real feeling from your day.',
      'If someone wants to say more ("I feel excited because…"), make space — but never push.',
      'Close the circle with a breath together, and do it again tomorrow. The magic is in the repetition.',
    ],
    stepImgs: [
      'assets/steps/feelings-circle-1.svg',
      'assets/steps/feelings-circle-2.svg',
      'assets/steps/feelings-circle-3.svg',
      'assets/steps/feelings-circle-4.svg',
      'assets/steps/feelings-circle-5.svg',
      'assets/steps/feelings-circle-6.svg',
    ],
  },
  'emotion-portraits': {
    title: 'Emotion Portraits',
    steps: [
      'Set out paper and markers, and pick 4–5 feelings to draw — start with happy, sad, angry, surprised, scared.',
      'Before drawing each one, make the face together in a mirror. What are your eyebrows doing? Your mouth?',
      'Draw a portrait of that feeling — a face, a whole person, or even just colors and shapes.',
      "Compare the portraits: what's different between the angry face and the surprised face?",
      'Talk about a time your child felt each one. Where did they feel it in their body?',
      'Hang the portraits up — they become a feelings chart your child can point to on big-feeling days.',
    ],
    stepImgs: [
      'assets/steps/emotion-portraits-1.svg',
      'assets/steps/emotion-portraits-2.svg',
      'assets/steps/emotion-portraits-3.svg',
      'assets/steps/emotion-portraits-4.svg',
      'assets/steps/emotion-portraits-5.svg',
      'assets/steps/emotion-portraits-6.svg',
    ],
  },
  'mood-diary': {
    title: 'Mood Diary',
    steps: [
      'Pick a notebook together and decorate the cover — it should feel like theirs, not homework.',
      'Choose a regular moment for a one-minute entry, like right before bed.',
      "Each entry gets three tiny things: today's strongest feeling, what was happening, and where they felt it in their body.",
      'Younger writers can draw a face and dictate the rest to you.',
      'Once a week, read back through together like detectives: do any patterns show up?',
      'Spot one pattern and make one small plan — "Grumpy before dinner? Snack at 4:30."',
    ],
    stepImgs: [
      'assets/steps/mood-diary-1.svg',
      'assets/steps/mood-diary-2.svg',
      'assets/steps/mood-diary-3.svg',
      'assets/steps/mood-diary-4.svg',
      'assets/steps/mood-diary-5.svg',
      'assets/steps/mood-diary-6.svg',
    ],
  },
  'musical-drawings': {
    title: 'Musical Drawings',
    steps: [
      'Grab paper and markers, and pick a song with a clear mood.',
      'Start the music and let your marker move however the music feels — fast, slow, loopy, or sharp.',
      "When a line goes somewhere you didn't mean it to, don't erase it.",
      "Turn that 'oops' line into something — a cloud, a wave, a creature, part of the picture.",
      'Switch to a song with a different mood and keep going on the same page.',
      'When the music stops, look at your art together — which mistakes became your favorite parts?',
    ],
    stepImgs: [
      'assets/steps/musical-drawings-1.svg',
      'assets/steps/musical-drawings-2.svg',
      'assets/steps/musical-drawings-3.svg',
      'assets/steps/musical-drawings-4.svg',
      'assets/steps/musical-drawings-5.svg',
      'assets/steps/musical-drawings-6.svg',
    ],
  },
};

// Onboarding challenges parents can pick from. Shared by the onboarding screen and
// the activity-suggestion logic so labels stay in sync.
export const PRESET_CHALLENGES: { id: string; label: string }[] = [
  { id: 'naming', label: 'Trouble naming feelings' },
  { id: 'meltdowns', label: 'Big reactions' },
  { id: 'transitions', label: 'Tantrums during transition' },
  { id: 'calming', label: 'Hard to calm down' },
  { id: 'confidence', label: 'Low confidence or self-doubt' },
];
