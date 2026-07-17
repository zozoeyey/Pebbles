import { useState, useRef, useCallback } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { getSessionId } from '../lib/session';

type RecorderState = 'idle' | 'recording' | 'processing' | 'result' | 'error';

interface UseAudioRecorderResult {
  state: RecorderState;
  isRecording: boolean;
  summary: string;
  /** Raw Whisper transcript — the parent's own words, shown for trust. */
  transcript: string;
  /** DB id of the saved reflection — null until processing succeeds. */
  reflectionId: string | null;
  error: string;
  timerDisplay: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecorder: () => void;
}

export function useAudioRecorder(
  activityId: string,
  activityTitle: string,
  selectedAge: number | null,
): UseAudioRecorderResult {
  const [state, setState] = useState<RecorderState>('idle');
  const [summary, setSummary] = useState('');
  const [transcript, setTranscript] = useState('');
  const [reflectionId, setReflectionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [timerDisplay, setTimerDisplay] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  const resetRecorder = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    secondsRef.current = 0;
    setTimerDisplay('');
    setSummary('');
    setTranscript('');
    setReflectionId(null);
    setError('');
    setState('idle');
  }, []);

  const processRecording = useCallback(
    async (chunks: Blob[], mimeType: string) => {
      setState('processing');
      const audioBlob = new Blob(chunks, { type: mimeType });
      const ext = mimeType.includes('mp4') ? 'm4a' : 'webm';
      const form = new FormData();
      form.append('audio', audioBlob, `audio.${ext}`);
      form.append('activity_id', activityId);
      form.append('activity_title', activityTitle);
      if (selectedAge) form.append('child_age', String(selectedAge));
      form.append('session_id', getSessionId());

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/process-reflection`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: form,
        });
        if (!res.ok) throw new Error(await res.text());
        const { summary: s, transcript: t, id } = (await res.json()) as { summary: string; transcript: string; id: string | null };
        setSummary(s);
        setTranscript(t ?? '');
        setReflectionId(id ?? null);
        setState('result');
      } catch (err) {
        console.error(err);
        setError('Something went wrong — please try again.');
        setState('error');
      }
    },
    [activityId, activityTitle, selectedAge],
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4';
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        processRecording(audioChunksRef.current, mimeType);
      };
      mr.start(250);
      setState('recording');

      secondsRef.current = 0;
      setTimerDisplay('00:00');
      timerRef.current = setInterval(() => {
        secondsRef.current++;
        const m = String(Math.floor(secondsRef.current / 60)).padStart(2, '0');
        const s = String(secondsRef.current % 60).padStart(2, '0');
        setTimerDisplay(`${m}:${s}`);
      }, 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone access and try again.');
      setState('error');
    }
  }, [processRecording]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  }, []);

  return {
    state,
    isRecording: state === 'recording',
    summary,
    transcript,
    reflectionId,
    error,
    timerDisplay,
    startRecording,
    stopRecording,
    resetRecorder,
  };
}
