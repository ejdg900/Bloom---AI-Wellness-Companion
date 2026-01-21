import React, { useMemo } from 'react';
import { QUOTES } from '../constants';
import { MoodEntry, AppMode } from '../types';
import { Quote, Sparkles, ArrowRight, Sun, Moon, CloudSun } from 'lucide-react';

interface HomeProps {
  moodEntries: MoodEntry[];
  onNavigate: (mode: AppMode) => void;
}

const Home: React.FC<HomeProps> = ({ moodEntries, onNavigate }) => {
  // Get random quote only once per mount
  const quote = useMemo(() => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }, []);

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: <Sun className="text-orange-400" size={24} /> };
    if (hour < 18) return { text: 'Good afternoon', icon: <CloudSun className="text-yellow-500" size={24} /> };
    return { text: 'Good evening', icon: <Moon className="text-indigo-400" size={24} /> };
  };

  const greeting = getGreeting();

  // Get latest mood
  const latestMood = moodEntries.length > 0 
    ? moodEntries[moodEntries.length - 1] 
    : null;

  return (
    <div className="p-4 md:p-6 pb-24 h-full overflow-y-auto bg-m3-surface">
      {/* Header / Greeting */}
      <div className="mb-8 pt-4">
        <div className="flex items-center gap-2 mb-2">
          {greeting.icon}
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {greeting.text}
          </span>
        </div>
        <h2 className="text-3xl font-normal text-slate-800">
          Welcome back to <span className="text-m3-primary font-medium">Bloom</span>
        </h2>
      </div>

      <div className="grid gap-6">
        {/* Daily Quote Card */}
        <div className="bg-m3-surfaceContainer p-6 rounded-[2rem] shadow-sm border border-m3-outline relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Quote size={80} className="text-m3-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-m3-primary">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Daily Inspiration</span>
            </div>
            <p className="text-xl font-medium text-slate-700 leading-relaxed mb-4 font-serif italic">
              "{quote.text}"
            </p>
            <p className="text-sm text-slate-500 font-medium">
              — {quote.author}
            </p>
          </div>
        </div>

        {/* Mood Summary Card */}
        <div 
          onClick={() => onNavigate(AppMode.MOOD)}
          className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-[2rem] shadow-sm border border-teal-100 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-slate-800">Latest Check-in</h3>
            <div className="p-2 bg-white rounded-full text-slate-400">
              <ArrowRight size={20} />
            </div>
          </div>
          
          {latestMood ? (
            <div className="flex items-center gap-4 mt-2">
              <div className="text-5xl filter drop-shadow-sm">{latestMood.mood}</div>
              <div>
                <p className="font-bold text-slate-700 text-lg">{latestMood.label}</p>
                <p className="text-xs text-slate-500">
                  {latestMood.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {latestMood.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <Sun size={24} />
              </div>
              <div>
                <p className="font-medium text-slate-600">No mood logged yet</p>
                <p className="text-xs text-slate-400">Tap to track how you feel</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action: Start Chat */}
        <div 
          onClick={() => onNavigate(AppMode.CHAT)}
          className="bg-m3-primaryContainer p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div>
            <h3 className="text-lg font-bold text-m3-onPrimaryContainer">Talk to Bloom</h3>
            <p className="text-sm text-m3-onPrimaryContainer/80">I'm here to listen.</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-m3-onPrimaryContainer">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;