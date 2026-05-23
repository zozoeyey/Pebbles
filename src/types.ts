export type Screen =
  | 'welcome'
  | 'age'
  | 'challenge'
  | 'sel'
  | 'results'
  | 'detail'
  | 'activity'
  | 'reflection'
  | 'toolkit'
  | 'community'
  | 'community-expand';

export interface Activity {
  id: string;
  title: string;
  description: string;
  grades: string[];
  type: string;
  source: string;
  url: string;
  skills: string[];
  time: string;
  timeBucket: string;
  content: ActivityContent | null;
}

export interface ActivityContent {
  overview?: string;
  materials?: string[];
  steps?: string[];
  tips?: string;
}

export interface ExploreAct {
  id: string;
  title: string;
  time: string;
  skill: string;
  skillVal: string;
  timeVal: string;
  refs: string;
  desc: string;
  detailDesc: string;
  materials: string[];
  tip: string;
  url: string;
  videoUrl: string | null;
  videoTitle: string;
  videoDesc: string;
}

export interface CommunityReflection {
  age: number;
  time: string;
  bg: string;
  charFill: string;
  text: string;
  likes: number;
}

export interface PeerReflection {
  paragraphs: string[];
  attribution: string;
}

export interface ActConfig {
  title: string;
  audioSrc: string;
  steps: string[];
  stepTimes: number[];
}
