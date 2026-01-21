import React, { useState, useEffect } from 'react';
import { TOOLS } from '../constants';
import { Play, Pause, RotateCcw, X, Wind } from 'lucide-react';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 pb-24 h-full overflow-y-auto bg-m3-surface">
      <h2 className="text-2xl font-normal text-slate-800 mb-6 flex items-center gap-3 pl-2">
        <Wind className="text-m3-primary" size={28} /> Wellness Tools
      </h2>

      {activeTool === 'box-breathing' ? (
        <BoxBreathing onClose={() => setActiveTool(null)} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="bg-m3-surfaceContainer p-6 rounded-3xl shadow-sm border border-m3-outline hover:shadow-md hover:border-m3-primary/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl filter drop-shadow-sm">{tool.icon}</span>
                <span className="bg-m3-primaryContainer text-m3-onPrimaryContainer text-xs font-semibold px-3 py-1 rounded-full">
                  {tool.duration}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-m3-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
          
          {/* Crisis Resource Card - M3 styling */}
          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-rose-800 mb-2">Need Immediate Help?</h3>
            <p className="text-rose-600 text-sm mb-4">You are not alone.</p>
            <a href="tel:988" className="px-6 py-3 bg-rose-500 text-white rounded-full text-sm font-bold hover:bg-rose-600 transition-colors shadow-sm w-full">
              Call 988 (US)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const BoxBreathing: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out' | 'idle'>('idle');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase !== 'idle') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
             switch(phase) {
               case 'inhale': setPhase('hold-in'); return 4;
               case 'hold-in': setPhase('exhale'); return 4;
               case 'exhale': setPhase('hold-out'); return 4;
               case 'hold-out': 
                 setCycleCount(c => c + 1);
                 setPhase('inhale'); 
                 return 4;
               default: return 4;
             }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const toggleStart = () => {
    if (phase === 'idle') {
      setPhase('inhale');
      setTimeLeft(4);
    } else {
      setPhase('idle');
      setTimeLeft(4);
    }
  };

  const getInstruction = () => {
    switch(phase) {
      case 'inhale': return "Breathe In...";
      case 'hold-in': return "Hold...";
      case 'exhale': return "Breathe Out...";
      case 'hold-out': return "Hold...";
      default: return "Ready?";
    }
  };

  const getScale = () => {
     switch(phase) {
       case 'inhale': return 'scale-125';
       case 'hold-in': return 'scale-125';
       case 'exhale': return 'scale-100';
       case 'hold-out': return 'scale-100';
       default: return 'scale-100';
     }
  };

  return (
    <div className="bg-m3-surfaceContainer rounded-[32px] p-8 shadow-md border border-m3-outline flex flex-col items-center max-w-lg mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-8">
        <h3 className="text-xl font-medium text-slate-800">Box Breathing</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <X size={24} />
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <div className={`absolute w-40 h-40 bg-teal-100/50 rounded-full transition-transform duration-[4000ms] ease-linear ${getScale()}`}></div>
        <div className={`absolute w-32 h-32 bg-teal-200/50 rounded-full transition-transform duration-[4000ms] ease-linear ${getScale()}`}></div>
        
        <div className="z-10 text-center">
          <div className="text-2xl font-bold text-teal-800 mb-1">{getInstruction()}</div>
          {phase !== 'idle' && <div className="text-4xl font-bold text-teal-600">{timeLeft}</div>}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleStart}
          className="flex items-center gap-2 px-8 py-4 bg-m3-primary hover:bg-teal-700 text-white rounded-full font-medium transition-all shadow-md"
        >
          {phase === 'idle' ? <><Play size={20} /> Start</> : <><Pause size={20} /> Pause</>}
        </button>
        {phase !== 'idle' && (
           <button onClick={() => {setPhase('idle'); setTimeLeft(4); setCycleCount(0);}} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
             <RotateCcw size={20} />
           </button>
        )}
      </div>
      
      {cycleCount > 0 && <p className="mt-6 text-slate-400 text-sm">Cycles completed: {cycleCount}</p>}
    </div>
  );
};

export default Tools;