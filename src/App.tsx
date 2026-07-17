import { useEffect, useState } from 'react';
import { useSavedActivities } from './hooks/useSavedActivities';
import { logEvent } from './lib/analytics';
import { syncOnboarding } from './lib/onboardingApi';
import './styles.css';
import type { Screen } from './types';

import WelcomeScreen from './screens/WelcomeScreen';
import AgeScreen from './screens/AgeScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import SelScreen from './screens/SelScreen';
import ResultsScreen from './screens/ResultsScreen';
import DetailScreen from './screens/DetailScreen';
import ActivityScreen from './screens/ActivityScreen';
import ReflectionScreen from './screens/ReflectionScreen';
import ToolkitScreen from './screens/ToolkitScreen';
import CommunityScreen from './screens/CommunityScreen';
import CommunityExpandScreen from './screens/CommunityExpandScreen';
import CreateActivityScreen from './screens/CreateActivityScreen';
import ProfileScreen from './screens/ProfileScreen';

const SCREEN_TITLES: Record<Screen, string> = {
  welcome: 'Pebbles',
  age: 'Pebbles',
  challenge: 'Pebbles',
  sel: 'Pebbles',
  results: 'Pebbles – Explore',
  detail: 'Pebbles – Activity',
  activity: 'Pebbles – Activity',
  reflection: 'Pebbles – Reflect',
  toolkit: 'Pebbles – Toolkit',
  community: 'Pebbles – Community',
  'community-expand': 'Pebbles – Community',
  'create-activity': 'Pebbles – Create',
  profile: 'Pebbles – Profile',
};

// Onboarding answers persist across visits so a returning parent keeps their
// profile and suggestions without logging in.
const PROFILE_KEY = 'pebbles_profile';

interface StoredProfile {
  age: number | null;
  challenges: string[];
  customText: string;
  selDefinition: string;
  emotionHandling: string;
}

function loadProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { age: null, challenges: [], customText: '', selDefinition: '', emotionHandling: '', ...JSON.parse(raw) };
  } catch { /* fall through */ }
  return { age: null, challenges: [], customText: '', selDefinition: '', emotionHandling: '' };
}

export default function App() {
  const stored = loadProfile();
  // Returning users with a saved profile land on Explore, not onboarding.
  const [screen, setScreen] = useState<Screen>(stored.age != null ? 'results' : 'welcome');
  // First-timers must finish onboarding; only returning users may skip it.
  const [hasOnboarded] = useState(stored.age != null);

  function attemptSkip(): boolean {
    if (!hasOnboarded) return false;
    showScreen('results');
    return true;
  }
  const { saved, toggle: toggleSaved, isSaved } = useSavedActivities();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [expandActivityId, setExpandActivityId] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<number | null>(stored.age);
  const [selectedChallenges, setSelectedChallenges] = useState<Set<string>>(new Set(stored.challenges));
  const [customChallengeText, setCustomChallengeText] = useState(stored.customText);
  // Free-text answers from the SEL onboarding screen — fed into activity suggestions.
  const [selAnswers, setSelAnswers] = useState({
    selDefinition: stored.selDefinition,
    emotionHandling: stored.emotionHandling,
  });

  // One event per app open — "sessions/week" = distinct session-days in SQL.
  useEffect(() => {
    logEvent('session_start');
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        age: selectedAge,
        challenges: [...selectedChallenges],
        customText: customChallengeText,
        selDefinition: selAnswers.selDefinition,
        emotionHandling: selAnswers.emotionHandling,
      } satisfies StoredProfile));
    } catch { /* private mode — profile just won't persist */ }
    // Mirror profile edits into the onboarding table (skip pre-onboarding emptiness).
    const hasAnything = selectedAge != null || selectedChallenges.size > 0
      || customChallengeText.trim() !== '' || selAnswers.selDefinition !== '' || selAnswers.emotionHandling !== '';
    if (hasAnything) {
      syncOnboarding({
        age: selectedAge,
        challengeIds: [...selectedChallenges],
        customText: customChallengeText,
        selDefinition: selAnswers.selDefinition,
        emotionHandling: selAnswers.emotionHandling,
      });
    }
  }, [selectedAge, selectedChallenges, customChallengeText, selAnswers]);

  function showScreen(s: Screen) {
    setScreen(s);
    document.title = SCREEN_TITLES[s] || 'Pebbles';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showResults() {
    showScreen('results');
  }

  function handleExpandCard(activityId: string) {
    setExpandActivityId(activityId);
    showScreen('community-expand');
  }

  function handleStartActivity(id: string) {
    setSelectedActivityId(id);
    showScreen('activity');
  }

  function handleGoReflect() {
    showScreen('reflection');
  }

  return (
    <div id="app">
      {screen === 'welcome' && (
        <WelcomeScreen showScreen={showScreen} />
      )}
      {screen === 'age' && (
        <AgeScreen
          showScreen={showScreen}
          showResults={showResults}
          onSkip={attemptSkip}
          onAgeSelect={setSelectedAge}
        />
      )}
      {screen === 'challenge' && (
        <ChallengeScreen
          showScreen={showScreen}
          showResults={showResults}
          onSkip={attemptSkip}
          onChallengeSelect={(ids, custom) => {
            setSelectedChallenges(ids);
            setCustomChallengeText(custom);
          }}
        />
      )}
      {screen === 'sel' && (
        <SelScreen
          showResults={showResults}
          onSkip={attemptSkip}
          selectedAge={selectedAge}
          selectedChallenges={selectedChallenges}
          customChallengeText={customChallengeText}
          onSelAnswers={(selDefinition, emotionHandling) => setSelAnswers({ selDefinition, emotionHandling })}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          showScreen={showScreen}
          onSelectActivity={(id) => setSelectedActivityId(id)}
          activeTab="results"
          isSaved={isSaved}
          toggleSaved={toggleSaved}
          selectedAge={selectedAge}
          selectedChallenges={selectedChallenges}
          customChallengeText={customChallengeText}
          selAnswers={selAnswers}
        />
      )}
      {screen === 'detail' && (
        <DetailScreen
          showScreen={showScreen}
          selectedActivityId={selectedActivityId}
          onStartActivity={handleStartActivity}
        />
      )}
      {screen === 'activity' && (
        <ActivityScreen
          showScreen={showScreen}
          selectedActivityId={selectedActivityId}
          onGoReflect={handleGoReflect}
        />
      )}
      {screen === 'reflection' && (
        <ReflectionScreen
          showScreen={showScreen}
          selectedActivityId={selectedActivityId}
          selectedAge={selectedAge}
        />
      )}
      {screen === 'toolkit' && (
        <ToolkitScreen
          showScreen={showScreen}
          savedIds={saved}
          onSelectActivity={(id) => setSelectedActivityId(id)}
        />
      )}
      {screen === 'community' && (
        <CommunityScreen
          showScreen={showScreen}
          onExpandCard={handleExpandCard}
        />
      )}
      {screen === 'community-expand' && (
        <CommunityExpandScreen
          showScreen={showScreen}
          expandActivityId={expandActivityId}
        />
      )}
      {screen === 'create-activity' && (
        <CreateActivityScreen
          showScreen={showScreen}
          onSaveCustom={() => showScreen('toolkit')}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          showScreen={showScreen}
          activeTab="profile"
          selectedAge={selectedAge}
          onAgeChange={setSelectedAge}
          selectedChallenges={selectedChallenges}
          customChallengeText={customChallengeText}
          onChallengesChange={(ids, custom) => {
            setSelectedChallenges(ids);
            setCustomChallengeText(custom);
          }}
          selAnswers={selAnswers}
          onSelAnswers={(selDefinition, emotionHandling) => setSelAnswers({ selDefinition, emotionHandling })}
        />
      )}
    </div>
  );
}
