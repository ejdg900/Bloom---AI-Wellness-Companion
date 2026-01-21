export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  MOOD = 'MOOD',
  JOURNAL = 'JOURNAL',
}

export interface MoodEntry {
  id: string;
  mood: string; // emoji
  label: string;
  timestamp: Date;
  note: string;
}

export interface WellnessTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
}