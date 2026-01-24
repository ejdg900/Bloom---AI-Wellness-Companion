import React, { useMemo } from 'react';
import { QUOTES } from '../constants';
import { MoodEntry, AppMode } from '../types';
import { Quote, Sparkles, ArrowRight, Sun, Moon, CloudSun, Wind, Activity, Sun as SunIcon } from 'lucide-react';

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
    if (hour < 12) return { text: 'Good morning', icon: <Sun className="text-orange-400" size={20} /> };
    if (hour < 18) return { text: 'Good afternoon', icon: <CloudSun className="text-yellow-500" size={20} /> };
    return { text: 'Good evening', icon: <Moon className="text-indigo-400" size={20} /> };
  };

  const greeting = getGreeting();

  // Get latest mood
  const latestMood = moodEntries.length > 0 
    ? moodEntries[moodEntries.length - 1] 
    : null;

  return (
    <div className="flex flex-col h-full bg-m3-surface animate-fade-in">
      <div className="p-5 md:p-8 pb-32 overflow-y-auto custom-scrollbar">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1 opacity-80">
              {greeting.icon}
              <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">{greeting.text}</span>
            </div>
            <h1 className="text-3xl font-medium text-stone-800 tracking-tight">
              Hello, <span className="font-serif italic text-m3-primary">Friend</span>
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-m3-surfaceContainerHighest border-2 border-white shadow-sm overflow-hidden">
            {/* Placeholder User Avatar */}
             <div className="w-full h-full bg-gradient-to-tr from-teal-200 to-rose-200" />
          </div>
        </div>

        {/* Hero Card: Talk to Bloom (Primary Action) */}
        <div 
          onClick={() => onNavigate(AppMode.CHAT)}
          className="group relative w-full bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2rem] p-6 text-white shadow-xl shadow-teal-900/10 mb-6 cursor-pointer overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/15 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4 border border-white/10">
              <Sparkles size={12} />
              <span>AI Companion</span>
            </div>
            
            <h2 className="text-2xl font-medium mb-2 leading-tight">
              What's on your mind<br/>right now?
            </h2>
            <p className="text-teal-100 text-sm mb-6 max-w-[80%] leading-relaxed opacity-90">
              I'm here to listen without judgment. Let's work through it together.
            </p>

            <div className="flex items-center gap-3 font-semibold text-sm">
              <span className="bg-white text-teal-800 px-5 py-2.5 rounded-full shadow-sm group-hover:bg-teal-50 transition-colors">
                Start Chatting
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Daily Quote Card */}
          <div className="bg-m3-surfaceContainerLow p-5 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group hover:border-stone-200 transition-colors">
            <div className="absolute -right-4 -top-4 text-stone-50 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Quote size={100} />
            </div>
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                 <Quote size={14} />
              </div>
              <p className="text-sm font-medium text-stone-600 leading-relaxed font-serif italic line-clamp-4">
                "{quote.text}"
              </p>
            </div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-2">
              Daily Wisdom
            </p>
          </div>

          {/* Mood Pulse Card */}
          <div 
            onClick={() => onNavigate(AppMode.MOOD)}
            className="bg-m3-surfaceContainerLow p-5 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:border-teal-100 transition-colors group"
          >
            <div className="flex justify-between items-start">
               <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                 <Activity size={14} />
               </div>
               <div className="w-6 h-6 rounded-full bg-stone-50 text-stone-300 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                 <ArrowRight size={12} />
               </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
               {latestMood ? (
                 <>
                   <div className="text-5xl mb-2 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">{latestMood.mood}</div>
                   <span className="text-sm font-semibold text-stone-700">{latestMood.label}</span>
                   <span className="text-[10px] text-stone-400 mt-1">
                      {latestMood.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                 </>
               ) : (
                 <>
                   <div className="w-12 h-12 rounded-full border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-300 mb-2">
                     <span className="text-xl">+</span>
                   </div>
                   <span className="text-xs font-medium text-stone-400 text-center">Log Mood</span>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Quick Tools Strip */}
        <div>
           <h3 className="text-sm font-bold text-stone-800 mb-3 px-1">Quick Relief</h3>
           <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 custom-scrollbar">
              <ToolCard 
                 icon={<Wind size={18} />}
                 label="Breathe"
                 color="bg-sky-100 text-sky-700"
                 onClick={() => { /* Placeholder */ }}
              />
               <ToolCard 
                 icon={<Activity size={18} />}
                 label="Grounding"
                 color="bg-emerald-100 text-emerald-700"
                 onClick={() => { /* Placeholder */ }}
              />
               <ToolCard 
                 icon={<SunIcon size={18} />}
                 label="Body Scan"
                 color="bg-orange-100 text-orange-700"
                 onClick={() => { /* Placeholder */ }}
              />
           </div>
        </div>

      </div>
    </div>
  );
};

const ToolCard: React.FC<{ icon: React.ReactNode, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-3 pr-5 bg-m3-surfaceContainerLow rounded-2xl border border-stone-100 shadow-sm flex-shrink-0 active:scale-95 transition-transform"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-sm font-bold text-stone-700">{label}</span>
  </button>
);

export default Home;