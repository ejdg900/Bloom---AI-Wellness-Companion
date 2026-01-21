import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import Home from './components/Home';
import BloomLogo from './components/BloomLogo';
import { AppMode, MoodEntry } from './types';
import { 
  MessageCircle, Smile, Home as HomeIcon, BookHeart, Heart, X, 
  Zap, Eye, Layers, Activity, Wind, ChevronRight, Check, RefreshCw, Phone 
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [sosOpen, setSosOpen] = useState(false);

  // Lifted state for mood entries to share with Home
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', mood: '😊', label: 'Happy', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Good productive day' },
    { id: '2', mood: '😌', label: 'Calm', timestamp: new Date(Date.now() - 86400000), note: 'Went for a walk' },
    { id: '3', mood: '😐', label: 'Neutral', timestamp: new Date(), note: '' },
  ]);

  const handleAddMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => [...prev, entry]);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.HOME:
        return <Home moodEntries={moodEntries} onNavigate={setMode} />;
      case AppMode.CHAT:
        return <ChatInterface />;
      case AppMode.MOOD:
        return <MoodTracker entries={moodEntries} onAddEntry={handleAddMoodEntry} />;
      case AppMode.JOURNAL:
        return <div className="flex flex-col h-full items-center justify-center p-8 text-center text-slate-500">
          <BookHeart size={48} className="mb-4 text-m3-secondaryContainer text-rose-400" />
          <h2 className="text-xl font-semibold mb-2">Journaling Space</h2>
          <p>This feature is coming soon. Use the Chat to reflect with Bloom in the meantime!</p>
        </div>;
      default:
        return <Home moodEntries={moodEntries} onNavigate={setMode} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-m3-surface sm:rounded-[2.5rem] overflow-hidden border-x border-b sm:border border-m3-outline relative shadow-xl">
      {/* Header - M3 Top App Bar */}
      <header className="px-5 py-4 bg-m3-surfaceContainer flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <BloomLogo size={44} />
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Bloom
          </h1>
        </div>
        <div className="text-xs font-medium px-3 py-1 bg-m3-primaryContainer text-m3-onPrimaryContainer rounded-full">
          Beta
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative z-10 bg-m3-surface">
        {renderContent()}
      </main>

      {/* SOS Modal Overlay */}
      {sosOpen && <SosModal onClose={() => setSosOpen(false)} />}

      {/* Bottom Navigation - Custom TikTok-style Layout */}
      <nav className="bg-m3-surfaceContainer px-2 pb-2 pt-0 flex justify-between items-end z-20 border-t border-m3-outline relative h-[80px]">
        {/* Left Side */}
        <div className="flex-1 flex justify-around items-end pb-3">
          <NavButton
            active={mode === AppMode.HOME}
            onClick={() => setMode(AppMode.HOME)}
            icon={<HomeIcon size={24} />}
            label="Home"
          />
          <NavButton
            active={mode === AppMode.CHAT}
            onClick={() => setMode(AppMode.CHAT)}
            icon={<MessageCircle size={24} />}
            label="Chat"
          />
        </div>

        {/* Center Heart SOS Button */}
        <div className="relative -top-5 mx-2 z-30">
           <button
             onClick={() => setSosOpen(true)}
             className="group flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
           >
             <div className="relative drop-shadow-xl filter">
                 <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" /> {/* Rose 500 */}
                            <stop offset="100%" stopColor="#e11d48" /> {/* Rose 600 */}
                        </linearGradient>
                    </defs>
                    <path 
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                      fill="url(#heartGrad)" 
                      stroke="white"
                      strokeWidth="1.5"
                    />
                 </svg>
                 <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white tracking-widest pt-1.5 pointer-events-none">
                   SOS
                 </span>
             </div>
           </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-around items-end pb-3">
          <NavButton
            active={mode === AppMode.MOOD}
            onClick={() => setMode(AppMode.MOOD)}
            icon={<Smile size={24} />}
            label="Mood"
          />
          <NavButton
            active={mode === AppMode.JOURNAL}
            onClick={() => setMode(AppMode.JOURNAL)}
            icon={<BookHeart size={24} />}
            label="Journal"
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

// M3 Navigation Item
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 group w-14"
  >
    {/* Active Indicator: Pill Shape */}
    <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
      active 
        ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer' 
        : 'bg-transparent text-slate-500 group-hover:bg-slate-100'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { 
        size: 20, 
        fill: active ? "currentColor" : "none",
        className: active ? "text-m3-onPrimaryContainer" : "text-slate-500"
      })}
    </div>
    <span className={`text-[10px] font-medium transition-colors ${active ? 'text-m3-onPrimaryContainer' : 'text-slate-500'}`}>
      {label}
    </span>
  </button>
);

// --- SOS Logic Components ---

type CrisisMode = 'SELECT' | 'PANIC' | 'ANXIETY' | 'OVERWHELM' | 'BREATHE';

const SosModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<CrisisMode>('SELECT');

  // --- Anxiety State ---
  const [anxietyStep, setAnxietyStep] = useState(0);
  const groundingSteps = [
    { count: 5, label: "Things you see", color: "text-rose-500", bg: "bg-rose-50", icon: <Eye /> },
    { count: 4, label: "Things you can touch", color: "text-teal-500", bg: "bg-teal-50", icon: <Activity /> },
    { count: 3, label: "Things you hear", color: "text-blue-500", bg: "bg-blue-50", icon: <Wind /> },
    { count: 2, label: "Things you can smell", color: "text-purple-500", bg: "bg-purple-50", icon: <Smile /> },
    { count: 1, label: "Thing you can taste", color: "text-orange-500", bg: "bg-orange-50", icon: <Heart /> },
  ];

  // --- Overwhelm State ---
  const [taskIndex, setTaskIndex] = useState(0);
  const microTasks = [
    "Drink one sip of water.",
    "Unclench your jaw.",
    "Lower your shoulders.",
    "Take off your shoes.",
    "Look out the nearest window.",
    "Close your eyes for 10 seconds.",
    "Wiggle your toes."
  ];
  const nextTask = () => setTaskIndex((prev) => (prev + 1) % microTasks.length);

  // --- Breathing State ---
  const [breathePhase, setBreathePhase] = useState(0); // 0:Inhale, 1:Hold, 2:Exhale, 3:Hold
  const [timer, setTimer] = useState(4);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mode === 'BREATHE') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setBreathePhase((p) => (p + 1) % 4);
            return [4, 4, 4, 4][(breathePhase + 1) % 4];
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, breathePhase]);

  const getBreatheInstruction = () => {
    switch(breathePhase) {
      case 0: return { text: "Inhale", color: "text-teal-600", scale: "scale-100" };
      case 1: return { text: "Hold", color: "text-teal-800", scale: "scale-125" };
      case 2: return { text: "Exhale", color: "text-blue-600", scale: "scale-125" };
      case 3: return { text: "Hold", color: "text-blue-800", scale: "scale-100" };
      default: return { text: "Ready", color: "text-slate-500", scale: "scale-100" };
    }
  };

  const renderCrisisContent = () => {
    switch (mode) {
      case 'PANIC':
        return (
          <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm">
            <div className="relative mb-8">
               <div className="w-40 h-40 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
                 <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl">
                   <Heart size={64} fill="currentColor" className="animate-pulse" />
                 </div>
               </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">You are safe.</h3>
            <p className="text-slate-600 mb-8 px-4">
              This feeling is scary, but it cannot hurt you. It will pass. I am right here.
            </p>
            
            <div className="flex flex-col gap-3 w-full px-4">
               <a href="tel:988" className="flex items-center justify-center gap-2 w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
                 <Phone size={20} /> Call Crisis Line (988)
               </a>
               <button 
                 onClick={() => setMode('BREATHE')}
                 className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
               >
                 Help me breathe
               </button>
            </div>
          </div>
        );
      
      case 'ANXIETY':
        const currentStep = groundingSteps[anxietyStep];
        return (
          <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm px-4">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="text-teal-600" size={24} />
              <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Grounding Technique</span>
            </div>

            <div className="w-full mb-8">
               <div className="flex justify-between mb-2 px-2">
                 {groundingSteps.map((_, idx) => (
                   <div key={idx} className={`h-1.5 flex-1 mx-0.5 rounded-full transition-colors ${idx <= anxietyStep ? 'bg-teal-500' : 'bg-slate-200'}`} />
                 ))}
               </div>
            </div>

            <div className={`w-24 h-24 rounded-full ${currentStep.bg} flex items-center justify-center mb-6 transition-colors duration-500`}>
               <span className={`text-4xl font-bold ${currentStep.color}`}>{currentStep.count}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2 transition-all">
              Find {currentStep.count} {currentStep.label}
            </h3>
            <p className="text-slate-500 mb-10">
              Look around you. Take your time.
            </p>

            {anxietyStep < 4 ? (
              <button 
                onClick={() => setAnxietyStep(prev => prev + 1)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-md hover:bg-teal-700 active:scale-95 transition-all"
              >
                I found them <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setMode('SELECT')}
                className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-md hover:bg-green-700 active:scale-95 transition-all"
              >
                <Check size={20} /> I feel more grounded
              </button>
            )}
          </div>
        );

      case 'OVERWHELM':
        return (
          <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm px-4">
             <div className="flex items-center gap-2 mb-8">
              <Layers className="text-orange-500" size={24} />
              <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Micro-Steps</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Let's do just one thing.</h3>
            <p className="text-slate-500 mb-8">Forget the rest of the list for now.</p>

            <div className="bg-orange-50 border-2 border-orange-100 p-8 rounded-[2rem] w-full mb-8 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Check size={80} className="text-orange-500" />
               </div>
               <p className="text-2xl font-medium text-orange-900 leading-tight">
                 "{microTasks[taskIndex]}"
               </p>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={nextTask}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Skip
              </button>
              <button 
                onClick={() => setMode('SELECT')}
                className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all"
              >
                I did it
              </button>
            </div>
          </div>
        );

      case 'BREATHE':
        const instr = getBreatheInstruction();
        return (
           <div className="flex flex-col items-center text-center animate-fade-in w-full">
             <div className="flex items-center gap-2 mb-12">
               <Wind className="text-blue-500" size={24} />
               <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Box Breathing</span>
             </div>

             <div className="relative flex items-center justify-center mb-12">
               {/* Outer ring */}
               <div className={`w-64 h-64 border-4 border-blue-50 rounded-full flex items-center justify-center transition-all duration-1000 ${instr.scale === 'scale-125' ? 'border-blue-100' : ''}`}>
                  {/* Expanding Circle */}
                  <div className={`w-40 h-40 bg-blue-100/50 rounded-full absolute transition-all duration-[1000ms] ease-linear ${instr.scale === 'scale-125' ? 'scale-150 opacity-100' : 'scale-100 opacity-60'}`}></div>
                  
                  {/* Core Circle */}
                  <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm z-10 relative">
                    <span className={`text-2xl font-bold transition-colors duration-300 ${instr.color}`}>{instr.text}</span>
                    <span className="text-4xl font-light text-slate-300 mt-1 font-mono">{timer}</span>
                  </div>
               </div>
             </div>
             
             <p className="text-slate-400 max-w-xs">
               Focus on the circle. Follow the rhythm.
             </p>
           </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col p-6 animate-fade-in">
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {mode === 'SELECT' ? (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">I'm here with you.</h2>
              <p className="text-slate-500">What is happening right now?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
              <button
                onClick={() => setMode('PANIC')}
                className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-3xl hover:bg-rose-100 transition-colors group text-left"
              >
                <div className="w-12 h-12 bg-rose-200 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-rose-900">Panic Attack</h3>
                  <p className="text-xs text-rose-700">I need to calm down fast</p>
                </div>
              </button>

              <button
                onClick={() => { setAnxietyStep(0); setMode('ANXIETY'); }}
                className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-3xl hover:bg-purple-100 transition-colors group text-left"
              >
                <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">Anxiety Spiral</h3>
                  <p className="text-xs text-purple-700">My thoughts are racing</p>
                </div>
              </button>

              <button
                onClick={() => setMode('OVERWHELM')}
                className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-3xl hover:bg-orange-100 transition-colors group text-left"
              >
                <div className="w-12 h-12 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">Feeling Overwhelmed</h3>
                  <p className="text-xs text-orange-700">It's all too much</p>
                </div>
              </button>

              <button
                onClick={() => { setBreathePhase(0); setTimer(4); setMode('BREATHE'); }}
                className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-3xl hover:bg-blue-100 transition-colors group text-left"
              >
                <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <Wind size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Can't Breathe</h3>
                  <p className="text-xs text-blue-700">Help me catch my breath</p>
                </div>
              </button>
            </div>
            
            <p className="mt-8 text-xs text-slate-400 text-center max-w-xs">
              If you are in immediate danger, please call emergency services or 988.
            </p>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            <button 
              onClick={() => setMode('SELECT')}
              className="self-start mb-4 text-slate-500 font-medium text-sm flex items-center gap-1 hover:text-slate-800"
            >
              ← Back
            </button>
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              {renderCrisisContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;