import { useState } from 'react';
import { useSavedActivities } from './hooks/useSavedActivities';
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
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const { saved, toggle: toggleSaved, isSaved } = useSavedActivities();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [expandActivityId, setExpandActivityId] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<Set<string>>(new Set());
  const [customChallengeText, setCustomChallengeText] = useState('');

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
          onAgeSelect={setSelectedAge}
        />
      )}
      {screen === 'challenge' && (
        <ChallengeScreen
          showScreen={showScreen}
          showResults={showResults}
          onChallengeSelect={(ids, custom) => {
            setSelectedChallenges(ids);
            setCustomChallengeText(custom);
          }}
        />
      )}
      {screen === 'sel' && (
        <SelScreen
          showResults={showResults}
          selectedAge={selectedAge}
          selectedChallenges={selectedChallenges}
          customChallengeText={customChallengeText}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          showScreen={showScreen}
          onSelectActivity={(id) => setSelectedActivityId(id)}
          activeTab="results"
          isSaved={isSaved}
          toggleSaved={toggleSaved}
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
    </div>
  );
}
