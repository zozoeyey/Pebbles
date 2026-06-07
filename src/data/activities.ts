import type { Activity, ExploreAct, CommunityReflection, PeerReflection, ActConfig } from '../types';

export const EXPLORE_ACTS: ExploreAct[] = [
  {
    id: 'freeze-feelings',
    title: 'Freeze Feelings: An SEL Kernels Brain Game',
    time: '20 mins',
    skill: 'Identifying emotions',
    skillVal: 'Identifying emotions',
    timeVal: '20to30',
    refs: '18 reflections',
    desc: 'Kids move around and freeze when an emotion is called out — a playful way to connect movement with feeling words.',
    detailDesc:
      'Kids move around freely, and when an emotion is called out, they freeze in a pose that represents that feeling — a playful way to connect movement with feeling words.',
    materials: ['Music to dance to (any upbeat songs work!)'],
    tip: 'Model each feeling yourself, especially for younger children — exaggerate your facial expressions and body pose to help them understand.',
    url: 'https://ggie.berkeley.edu/practice/freeze-feelings-an-sel-kernels-brain-game/#tab__2',
    videoUrl: 'assets/video.mp4',
    videoTitle: 'Identifying Emotions',
    videoDesc:
      'Helping kids name their feelings is one of the most powerful things a parent can do — and this activity puts that idea into motion.',
    extraTags: ['Impulse & body control'],
    whenHelps:
      'Good when your child has lots of energy or finds it hard to stop and pause — a playful way to practice catching a feeling and showing it.',
  },
  {
    id: 'tense-and-relax',
    title: 'Tense and Relax',
    time: '10 mins',
    skill: 'Self-perception',
    skillVal: 'Self-perception',
    timeVal: '10to20',
    refs: '18 reflections',
    desc: 'Kids squeeze and release different muscle groups to feel the difference between tension and calm in their bodies.',
    detailDesc:
      'Kids squeeze and release different muscle groups to feel the contrast between tension and calm — a simple, effective technique for building body awareness and self-regulation.',
    materials: ['A quiet space', 'Optional: soft background music'],
    tip: "Go slowly and breathe deeply together. The contrast between tense and relaxed is the key learning moment — don't rush through it.",
    url: 'https://smho-smso.ca/emhc/stress-management-and-coping/stretching/tense-and-relax/',
    videoUrl: null,
    videoTitle: 'Building Body Awareness',
    videoDesc:
      'How body-based techniques help kids self-regulate and develop a stronger sense of their own physical and emotional state.',
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
  },
};

export const TOOLKIT_ACTIVE_DATES: Record<string, number[]> = {
  '2026-05': [8, 12, 17, 18, 19],
  '2026-04': [3, 10, 14, 22],
};
