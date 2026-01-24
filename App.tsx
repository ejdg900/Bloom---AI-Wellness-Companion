import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import Home from './components/Home';
import Journal from './components/Journal';
import BloomLogo from './components/BloomLogo';
import { AppMode, MoodEntry, Message, JournalEntry } from './types';
import { 
  MessageCircle, Smile, Home as HomeIcon, BookHeart, Heart, X, 
  Zap, Eye, Layers, Activity, Wind, ChevronRight, Check, RefreshCw, Phone 
} from 'lucide-react';

// Helper to revive Date objects from JSON strings during localStorage parsing
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [sosOpen, setSosOpen] = useState(false);

  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---

  // 1. Mood Entries
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_mood_entries');
      if (saved) return JSON.parse(saved, dateReviver);
    } catch (e) {
      console.error("Failed to load mood entries", e);
    }
    // Default initial data if storage is empty
    return [
      { id: '1', mood: '😊', label: 'Happy', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Good productive day' },
      { id: '2', mood: '😌', label: 'Calm', timestamp: new Date(Date.now() - 86400000), note: 'Went for a walk' },
      { id: '3', mood: '😐', label: 'Neutral', timestamp: new Date(), note: '' },
    ];
  });

  // 2. Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_journal_entries');
      if (saved) return JSON.parse(saved, dateReviver);
    } catch (e) {
      console.error("Failed to load journal entries", e);
    }
    return [];
  });

  // 3. Chat History
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_chat_history');
      if (saved) return JSON.parse(saved, dateReviver);
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [];
  });

  // --- EFFECT HOOKS TO SAVE DATA ON CHANGE ---

  useEffect(() => {
    localStorage.setItem('bloom_mood_entries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('bloom_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('bloom_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // --- EVENT HANDLERS ---

  const handleAddMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => [...prev, entry]);
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleReflectOnJournal = (entry: JournalEntry) => {
    setMode(AppMode.CHAT);
    const contextMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `I just wrote a journal entry titled "${entry.title}". Here is what I wrote:\n\n"${entry.content}"\n\nCan you help me reflect on this?`,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, contextMessage]);
  };

  const renderContent = () => {
    // We wrap content in a div with key={mode} to trigger M3 animations
    const content = () => {
        switch (mode) {
        case AppMode.HOME: return <Home moodEntries={moodEntries} onNavigate={setMode} />;
        case AppMode.CHAT: return <ChatInterface messages={chatHistory} setMessages={setChatHistory} />;
        case AppMode.MOOD: return <MoodTracker entries={moodEntries} onAddEntry={handleAddMoodEntry} />;
        case AppMode.JOURNAL: 
            return <Journal entries={journalEntries} onAddEntry={handleAddJournalEntry} onDeleteEntry={handleDeleteJournalEntry} onDiscuss={handleReflectOnJournal} />;
        default: return <Home moodEntries={moodEntries} onNavigate={setMode} />;
        }
    };

    return (
        <div key={mode} className="h-full w-full animate-fade-in">
            {content()}
        </div>
    );
  };

  return (
    // Updated container: added pt-safe to handle notches when in standalone mode
    <div className="flex flex-col h-full bg-m3-surface sm:rounded-[2.5rem] overflow-hidden border-x border-b sm:border border-m3-outline relative shadow-2xl transition-all duration-medium2 ease-emphasized pt-safe">
      {/* Header - M3 Small Top App Bar */}
      <header className="px-5 py-3 bg-m3-surfaceContainerLow flex justify-between items-center z-20 sticky top-0 border-b border-m3-outline/20">
        <div className="flex items-center gap-3">
          <BloomLogo size={36} />
          <h1 className="text-xl font-bold text-m3-onSurface tracking-tight">Bloom</h1>
        </div>
        <div className="w-10"></div> {/* Spacer to balance logo */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative z-10 bg-m3-surface">
        {renderContent()}
      </main>

      {/* SOS Modal Overlay */}
      {sosOpen && <SosModal onClose={() => setSosOpen(false)} />}

      {/* M3 Navigation Bar with Centered SOS Heart */}
      <nav className="bg-m3-surfaceContainerLow pb-4 z-20 border-t border-m3-outline/50 relative pb-safe">
        <div className="flex justify-between items-end px-4 pt-2">
            <NavButton
                active={mode === AppMode.HOME}
                onClick={() => setMode(AppMode.HOME)}
                icon={<HomeIcon />}
                label="Home"
            />
            <NavButton
                active={mode === AppMode.CHAT}
                onClick={() => setMode(AppMode.CHAT)}
                icon={<MessageCircle />}
                label="Chat"
            />
            
            {/* Center SOS Heart Button - Floating Style (Updated: Bigger & Text inside) */}
            <div className="relative -top-10 mx-2">
               <button 
                  onClick={() => setSosOpen(true)}
                  className="group relative flex items-center justify-center"
                  aria-label="Emergency SOS"
               >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-xl shadow-rose-200 text-white flex items-center justify-center border-[6px] border-m3-surfaceContainerLow animate-heartbeat active:scale-95 transition-transform">
                     <div className="relative flex items-center justify-center">
                        <Heart size={44} fill="currentColor" strokeWidth={0} />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[11px] font-black text-rose-500 mt-[2px] tracking-tighter">
                          SOS
                        </span>
                     </div>
                  </div>
               </button>
            </div>

            <NavButton
                active={mode === AppMode.MOOD}
                onClick={() => setMode(AppMode.MOOD)}
                icon={<Smile />}
                label="Mood"
            />
            <NavButton
                active={mode === AppMode.JOURNAL}
                onClick={() => setMode(AppMode.JOURNAL)}
                icon={<BookHeart />}
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
  icon: React.ReactElement<any>;
  label: string;
}

// M3 Standard Navigation Item
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 group flex-1 py-1"
  >
    {/* Active Indicator: Circle (Inactive) -> Pill (Active) Transition */}
    <div className={`relative h-8 rounded-full flex items-center justify-center overflow-hidden transition-all duration-medium3 ease-emphasized ${
      active 
        ? 'w-16 bg-m3-primaryContainer text-m3-onPrimaryContainer shadow-sm' 
        : 'w-10 bg-transparent text-m3-onSurfaceVariant group-hover:bg-m3-surfaceContainerHigh'
    }`}>
      {/* Icon with slight rotation/scale on active */}
      {React.cloneElement(icon, { 
        size: 24, 
        fill: active ? "currentColor" : "none",
        strokeWidth: active ? 0 : 2,
        className: `transition-all duration-medium3 ease-emphasized ${active ? 'scale-110' : 'scale-100'}`
      })}
    </div>
    
    {/* Label with scale/weight transition */}
    <span className={`text-[12px] font-medium tracking-wide transition-all duration-medium3 ease-emphasized ${
      active 
        ? 'text-m3-onSurface font-bold scale-105' 
        : 'text-m3-onSurfaceVariant scale-100 opacity-80'
    }`}>
      {label}
    </span>
  </button>
);

// --- SOS Logic Components ---
// (Kept identical to previous implementation, just reusing for brevity)
type CrisisMode = 'SELECT' | 'PANIC' | 'ANXIETY' | 'OVERWHELM' | 'BREATHE';
const GROUNDING_STEPS = [
  { count: 5, label: "Things you see", color: "text-rose-500", bg: "bg-rose-50", icon: <Eye /> },
  { count: 4, label: "Things you can touch", color: "text-teal-500", bg: "bg-teal-50", icon: <Activity /> },
  { count: 3, label: "Things you hear", color: "text-blue-500", bg: "bg-blue-50", icon: <Wind /> },
  { count: 2, label: "Things you can smell", color: "text-purple-500", bg: "bg-purple-50", icon: <Smile /> },
  { count: 1, label: "Thing you can taste", color: "text-orange-500", bg: "bg-orange-50", icon: <Heart /> },
];
const MICRO_TASKS = [
  "Drink one sip of water.", "Unclench your jaw.", "Lower your shoulders.", 
  "Take off your shoes.", "Look out the nearest window.", "Close your eyes for 10 seconds.", "Wiggle your toes."
];

const SosModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<CrisisMode>('SELECT');
  const [anxietyStep, setAnxietyStep] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const nextTask = () => setTaskIndex((prev) => (prev + 1) % MICRO_TASKS.length);
  const [breathePhase, setBreathePhase] = useState(0);
  const [timer, setTimer] = useState(4);
  
  useEffect(() => {
    let interval: number;
    if (mode === 'BREATHE') {
      interval = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setBreathePhase((p) => (p + 1) % 4);
            return [4, 4, 4, 4][(breathePhase + 1) % 4];
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [mode, breathePhase]);

  const getBreatheInstruction = () => {
    switch(breathePhase) {
      case 0: return { text: "Inhale", color: "text-teal-600", scale: "scale-100" };
      case 1: return { text: "Hold", color: "text-teal-800", scale: "scale-125" };
      case 2: return { text: "Exhale", color: "text-blue-600", scale: "scale-125" };
      case 3: return { text: "Hold", color: "text-blue-800", scale: "scale-100" };
      default: return { text: "Ready", color: "text-stone-500", scale: "scale-100" };
    }
  };

  const renderCrisisContent = () => {
    switch (mode) {
      case 'PANIC':
        return (
          // Added pt-safe to modal content to prevent clipping on notched phones
          <div className="flex flex-col items-center text-center animate-scale-in w-full max-w-sm pt-safe">
            <div className="relative mb-8">
               <div className="w-40 h-40 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
                 <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl">
                   <Heart size={64} fill="currentColor" className="animate-pulse" />
                 </div>
               </div>
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">You are safe.</h3>
            <p className="text-stone-600 mb-8 px-4 font-medium">This feeling is scary, but it cannot hurt you. It will pass.</p>
            <div className="flex flex-col gap-3 w-full px-4">
               <a href="tel:988" className="flex items-center justify-center gap-2 w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform duration-short4 ease-emphasized"><Phone size={20} /> Call Crisis Line (988)</a>
               <button onClick={() => setMode('BREATHE')} className="w-full py-4 bg-white border-2 border-stone-200 text-stone-700 rounded-2xl font-bold hover:bg-stone-50 transition-colors duration-short4">Help me breathe</button>
            </div>
          </div>
        );
      case 'ANXIETY':
        const currentStep = GROUNDING_STEPS[anxietyStep];
        return (
          <div className="flex flex-col items-center text-center animate-slide-up w-full max-w-sm px-4 pt-safe">
            <div className="flex items-center gap-2 mb-6"><Eye className="text-teal-600" size={24} /><span className="font-bold text-stone-500 uppercase tracking-widest text-xs">Grounding Technique</span></div>
            <div className="w-full mb-8"><div className="flex justify-between mb-2 px-2">{GROUNDING_STEPS.map((_, idx) => (<div key={idx} className={`h-1.5 flex-1 mx-0.5 rounded-full transition-colors duration-medium2 ${idx <= anxietyStep ? 'bg-teal-500' : 'bg-stone-200'}`} />))}</div></div>
            <div className={`w-24 h-24 rounded-full ${currentStep.bg} flex items-center justify-center mb-6 transition-colors duration-500`}><span className={`text-4xl font-bold ${currentStep.color}`}>{currentStep.count}</span></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2 transition-all">Find {currentStep.count} {currentStep.label}</h3>
            {anxietyStep < 4 ? <button onClick={() => setAnxietyStep(prev => prev + 1)} className="flex items-center justify-center gap-2 w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-md hover:bg-teal-700 active:scale-95 transition-all duration-short4 ease-emphasized">I found them <ChevronRight size={20} /></button> : <button onClick={() => setMode('SELECT')} className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-md hover:bg-green-700 active:scale-95 transition-all duration-short4 ease-emphasized"><Check size={20} /> I feel more grounded</button>}
          </div>
        );
      case 'OVERWHELM':
        return (
          <div className="flex flex-col items-center text-center animate-slide-up w-full max-w-sm px-4 pt-safe">
             <div className="flex items-center gap-2 mb-8"><Layers className="text-orange-500" size={24} /><span className="font-bold text-stone-500 uppercase tracking-widest text-xs">Micro-Steps</span></div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Let's do just one thing.</h3>
            <div className="bg-orange-50 border-2 border-orange-100 p-8 rounded-[2rem] w-full mb-8 shadow-sm relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><Check size={80} className="text-orange-500" /></div><p className="text-2xl font-bold text-orange-900 leading-tight">"{MICRO_TASKS[taskIndex]}"</p></div>
            <div className="flex gap-3 w-full"><button onClick={nextTask} className="flex-1 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"><RefreshCw size={18} /> Skip</button><button onClick={() => setMode('SELECT')} className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all duration-short4 ease-emphasized">I did it</button></div>
          </div>
        );
      case 'BREATHE':
        const instr = getBreatheInstruction();
        return (
           <div className="flex flex-col items-center text-center animate-fade-in w-full pt-safe">
             <div className="flex items-center gap-2 mb-12"><Wind className="text-blue-500" size={24} /><span className="font-bold text-stone-500 uppercase tracking-widest text-xs">Box Breathing</span></div>
             <div className="relative flex items-center justify-center mb-12"><div className={`w-64 h-64 border-4 border-blue-50 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${instr.scale === 'scale-125' ? 'border-blue-100' : ''}`}><div className={`w-40 h-40 bg-blue-100/50 rounded-full absolute transition-all duration-[1000ms] ease-linear ${instr.scale === 'scale-125' ? 'scale-150 opacity-100' : 'scale-100 opacity-60'}`}></div><div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm z-10 relative"><span className={`text-2xl font-bold transition-colors duration-300 ${instr.color}`}>{instr.text}</span><span className="text-4xl font-bold text-stone-300 mt-1 font-mono">{timer}</span></div></div></div>
             <p className="text-stone-400 max-w-xs font-medium">Focus on the circle. Follow the rhythm.</p>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col p-6 animate-fade-in transition-all duration-medium2 pt-safe">
      <div className="flex justify-end"><button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"><X size={24} /></button></div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {mode === 'SELECT' ? (
          <>
            <div className="mb-8 text-center animate-slide-up"><h2 className="text-2xl font-bold text-stone-800 mb-2">I'm here with you.</h2><p className="text-stone-500 font-medium">What is happening right now?</p></div>
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
              <button onClick={() => setMode('PANIC')} className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-3xl hover:bg-rose-100 transition-colors group text-left animate-slide-up" style={{animationDelay: '0ms'}}><div className="w-12 h-12 bg-rose-200 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform duration-short4 ease-emphasized"><Zap size={24} /></div><div><h3 className="font-bold text-rose-900">Panic Attack</h3><p className="text-xs text-rose-700 font-bold">I need to calm down fast</p></div></button>
              <button onClick={() => { setAnxietyStep(0); setMode('ANXIETY'); }} className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-3xl hover:bg-purple-100 transition-colors group text-left animate-slide-up" style={{animationDelay: '50ms'}}><div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform duration-short4 ease-emphasized"><Activity size={24} /></div><div><h3 className="font-bold text-purple-900">Anxiety Spiral</h3><p className="text-xs text-purple-700 font-bold">My thoughts are racing</p></div></button>
              <button onClick={() => setMode('OVERWHELM')} className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-3xl hover:bg-orange-100 transition-colors group text-left animate-slide-up" style={{animationDelay: '100ms'}}><div className="w-12 h-12 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-short4 ease-emphasized"><Layers size={24} /></div><div><h3 className="font-bold text-orange-900">Feeling Overwhelmed</h3><p className="text-xs text-orange-700 font-bold">It's all too much</p></div></button>
              <button onClick={() => { setBreathePhase(0); setTimer(4); setMode('BREATHE'); }} className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-3xl hover:bg-blue-100 transition-colors group text-left animate-slide-up" style={{animationDelay: '150ms'}}><div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-short4 ease-emphasized"><Wind size={24} /></div><div><h3 className="font-bold text-blue-900">Can't Breathe</h3><p className="text-xs text-blue-700 font-bold">Help me catch my breath</p></div></button>
            </div>
            <p className="mt-8 text-xs text-stone-400 text-center max-w-xs font-medium animate-fade-in">If you are in immediate danger, please call emergency services or 988.</p>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center"><button onClick={() => setMode('SELECT')} className="self-start mb-4 text-stone-500 font-bold text-sm flex items-center gap-1 hover:text-stone-800 transition-colors duration-short4">← Back</button><div className="flex-1 flex flex-col items-center justify-center w-full">{renderCrisisContent()}</div></div>
        )}
      </div>
    </div>
  );
};

export default App;