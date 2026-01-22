import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BookHeart, Plus, Calendar, ChevronLeft, Sparkles, MessageCircle, Trash2, PenLine, Lightbulb } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onDiscuss: (entry: JournalEntry) => void;
}

const PROMPTS = [
  "What is one thing that made you smile today?",
  "Write a letter to your future self.",
  "What is a challenge you are facing, and how can you handle it?",
  "List 3 things you are grateful for right now.",
  "How is your body feeling at this very moment?",
  "What is a boundary you need to set this week?",
  "Describe your perfect safe space.",
  "What would you say to a friend who is feeling how you feel?"
];

type ViewMode = 'LIST' | 'WRITE' | 'READ';

const Journal: React.FC<JournalProps> = ({ entries, onAddEntry, onDeleteEntry, onDiscuss }) => {
  const [view, setView] = useState<ViewMode>('LIST');
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const handleStartWriting = () => {
    setTitle('');
    setContent('');
    setSelectedMood('');
    setView('WRITE');
  };

  const handleSave = () => {
    if (!content.trim()) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim() || 'Untitled Entry',
      content: content,
      timestamp: new Date(),
      mood: selectedMood || undefined
    };
    
    onAddEntry(newEntry);
    setView('LIST');
  };

  const handleRead = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setView('READ');
  };

  const insertPrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setTitle(randomPrompt);
  };

  const MOOD_STICKERS = ['😊', '😌', '😔', '😤', '😰', '😴', '💪', '✨'];

  // --- RENDER: WRITE MODE ---
  if (view === 'WRITE') {
    return (
      <div className="flex flex-col h-full bg-white relative animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <button 
            onClick={() => setView('LIST')}
            className="p-2 -ml-2 text-stone-500 hover:bg-stone-50 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-stone-700">New Entry</span>
          <button 
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-1.5 bg-m3-primary text-white text-sm font-bold rounded-full disabled:opacity-50 transition-all active:scale-95"
          >
            Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-32">
          {/* Mood Selector */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {MOOD_STICKERS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedMood(selectedMood === emoji ? '' : emoji)}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-full border transition-all ${
                  selectedMood === emoji 
                    ? 'bg-m3-primaryContainer border-m3-primary scale-110 shadow-sm' 
                    : 'bg-white border-stone-200 hover:bg-stone-50 grayscale hover:grayscale-0'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold text-stone-800 placeholder:text-stone-300 border-none focus:ring-0 p-0 mb-4 bg-transparent"
          />

          <textarea
            placeholder="Start writing here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[60vh] resize-none text-lg leading-relaxed text-stone-600 placeholder:text-stone-300 border-none focus:ring-0 p-0 bg-transparent font-serif"
          />
        </div>

        {/* Toolbar */}
        <div className="absolute bottom-0 w-full bg-stone-50 border-t border-stone-200 p-3 flex gap-2">
           <button 
             onClick={insertPrompt}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 text-sm font-bold shadow-sm active:scale-95 transition-transform"
           >
             <Lightbulb size={16} className="text-yellow-500" /> Inspire Me
           </button>
        </div>
      </div>
    );
  }

  // --- RENDER: READ MODE ---
  if (view === 'READ' && activeEntry) {
    return (
      <div className="flex flex-col h-full bg-stone-50 relative animate-fade-in">
        <div className="flex items-center justify-between p-4 sticky top-0 bg-stone-50/95 backdrop-blur-sm z-10">
          <button 
            onClick={() => setView('LIST')}
            className="p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => { onDeleteEntry(activeEntry.id); setView('LIST'); }}
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 min-h-[70vh]">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                {activeEntry.timestamp.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              {activeEntry.mood && <span className="text-4xl">{activeEntry.mood}</span>}
            </div>
            
            <h1 className="text-2xl font-bold text-stone-800 mb-6 leading-tight">
              {activeEntry.title}
            </h1>
            
            <div className="prose prose-stone prose-lg text-stone-600 font-serif leading-loose whitespace-pre-wrap">
              {activeEntry.content}
            </div>
          </div>
        </div>

        {/* Action Button: Discuss with Bloom */}
        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
          <button
            onClick={() => onDiscuss(activeEntry)}
            className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full font-bold shadow-lg shadow-teal-200 active:scale-95 transition-all hover:shadow-xl"
          >
            <Sparkles size={20} /> Reflect with Bloom
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: LIST MODE ---
  return (
    <div className="p-4 md:p-6 pb-24 h-full overflow-y-auto bg-m3-surface">
      <div className="flex justify-between items-center mb-6 pl-2">
        <h2 className="text-2xl font-normal text-slate-800 flex items-center gap-3">
          <BookHeart className="text-m3-secondary" size={28} /> 
          <span>Journal</span>
        </h2>
        <button 
          onClick={handleStartWriting}
          className="w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-md"
        >
          <Plus size={24} />
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
          <PenLine size={64} className="mb-4 text-stone-300" />
          <h3 className="text-lg font-bold text-stone-600 mb-2">Your story starts here</h3>
          <p className="text-sm text-stone-400 max-w-xs mx-auto mb-6">
            Writing down your thoughts can help clear your mind. Try a prompt or just freestyle.
          </p>
          <button 
            onClick={handleStartWriting}
            className="px-6 py-3 bg-white border border-stone-300 rounded-full text-stone-600 font-bold text-sm hover:bg-stone-50"
          >
            Write First Entry
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.slice().reverse().map(entry => (
            <div 
              key={entry.id}
              onClick={() => handleRead(entry)}
              className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md hover:border-m3-primary/20 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <Calendar size={12} />
                  {entry.timestamp.toLocaleDateString()}
                </div>
                {entry.mood && <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{entry.mood}</span>}
              </div>
              
              <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-1 group-hover:text-m3-primary transition-colors">
                {entry.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2 font-serif leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;