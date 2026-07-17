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
  | 'community-expand'
  | 'create-activity'
  | 'profile';

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
  /** Core SEL tags: 'Identifying emotions' | 'Interoception' | 'Impulse control'. First one is primary. */
  skills: string[];
  timeVal: string;
  /** Display age range, e.g. 'Ages 4–7'. */
  ages: string;
  refs: string;
  desc: string;
  detailDesc: string;
  materials: string[];
  tip: string;
  /** How to adapt the activity for older kids, when the source describes one. */
  olderKids?: string;
  url: string;
  videoUrl: string | null;
  videoTitle: string;
  videoDesc: string;
  /** Still image shown behind the play button before the video starts. Defaults to opening.svg. */
  videoThumb?: string;
  whenHelps?: string;
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
  steps: string[];
  /**
   * One animated scene per step, same order as `steps`. Falls back to blob.svg.
   * SVGs in assets/steps/ are generated in-house (CSS-animated, Pebbles style).
   */
  stepImgs?: string[];
  /** Omit for read-only (text) activities that have no audio narration. */
  audioSrc?: string;
  /** Timestamps that map audio position to steps; omit for read-only activities. */
  stepTimes?: number[];
}
