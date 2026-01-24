import React, { useState, useMemo } from 'react';
import { MOODS } from '../constants';
import { MoodEntry } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { Calendar, Smile, Plus, TrendingUp, BarChart3, Clock } from 'lucide-react';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (entry: MoodEntry) => void;
}

// Helper to map mood labels to a numeric score for the chart (Valence)
const getMoodScore = (label: string): number => {
  switch(label) {
    case 'Happy': return 5;
    case 'Calm': return 4;
    case 'Neutral': return 3;
    case 'Sad': return 2;
    case 'Frustrated': return 2;
    case 'Anxious': return 1;
    case 'Overwhelmed': return 1;
    default: return 3;
  }
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onAddEntry }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (selectedMood === null) return;
    const moodData = MOODS[selectedMood];
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: moodData.emoji,
      label: moodData.label,
      timestamp: new Date(),
      note,
    };
    onAddEntry(newEntry);
    setSelectedMood(null);
    setNote('');
  };

  // Prepare data for "Emotional Flow" chart
  const chartData = useMemo(() => {
    // Take last 7 entries, reverse to show chronological order
    const recent = [...entries].slice(-10);
    return recent.map(e => ({
      time: e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: getMoodScore(e.label),
      mood: e.mood,
      label: e.label
    }));
  }, [entries]);

  // Calculate Stats
  const topMoodLabel = useMemo(() => {
    if (entries.length === 0) return 'None';
    const counts: Record<string, number> = {};
    entries.forEach(e => counts[e.label] = (counts[e.label] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [entries]);

  return (
    <div className="flex flex-col h-full bg-m3-surface animate-fade-in">
      {/* Sticky Header */}
      <div className="px-6 py-4 bg-m3-surface/90 backdrop-blur-md sticky top-0 z-10 border-b border-m3-outline/50">
         <h2 className="text-2xl font-normal text-m3-onSurface flex items-center gap-3">
          <Smile className="text-m3-primary" size={28} /> 
          <span>Mood Insights</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 custom-scrollbar space-y-6 pt-4">
        
        {/* Input Section - M3 Elevated Card */}
        <div className="bg-m3-surfaceContainerLow p-5 rounded-[28px] shadow-sm border border-m3-outline/50">
          <h3 className="text-lg font-medium text-m3-onSurfaceVariant mb-4 pl-1">How are you feeling right now?</h3>
          
          {/* Mood Selection Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 gap-y-4 mb-6">
            {MOODS.map((m, idx) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(idx)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 aspect-square ${
                  selectedMood === idx
                    ? `${m.color} ring-2 ring-offset-2 ring-m3-primary scale-105 shadow-md`
                    : 'bg-m3-surfaceContainerHigh text-m3-onSurfaceVariant hover:bg-m3-surfaceContainerHighest'
                }`}
              >
                <span className="text-3xl mb-1 filter drop-shadow-sm">{m.emoji}</span>
              </button>
            ))}
          </div>
          
          {/* Label of selected mood */}
          {selectedMood !== null && (
             <div className="text-center font-bold text-m3-primary mb-4 animate-fade-in">
                {MOODS[selectedMood].label}
             </div>
          )}

          {selectedMood !== null && (
            <div className="animate-fade-in space-y-3">
              <textarea
                className="w-full p-4 bg-m3-surfaceContainerHigh rounded-2xl border-none focus:ring-2 focus:ring-m3-primary/50 placeholder:text-stone-400 text-stone-700 resize-none transition-all"
                placeholder="Add a note... (optional)"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="w-full py-3.5 bg-m3-primary text-m3-onPrimary rounded-full font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:bg-teal-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} strokeWidth={3} /> LOG MOOD
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-[24px] border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Logs</span>
              <span className="text-3xl font-bold text-indigo-900">{entries.length}</span>
           </div>
           <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-[24px] border border-teal-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Top Mood</span>
              <span className="text-xl font-bold text-teal-900 truncate w-full">{topMoodLabel}</span>
           </div>
        </div>

        {/* Chart Section - Emotional Flow */}
        <div className="bg-m3-surfaceContainerLow p-6 rounded-[28px] shadow-sm border border-m3-outline/50">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-medium text-m3-onSurfaceVariant flex items-center gap-2">
               <TrendingUp size={20} className="text-m3-primary" /> Emotional Flow
             </h3>
             <span className="text-[10px] bg-m3-surfaceContainerHigh px-2 py-1 rounded-full text-m3-onSurfaceVariant font-bold">Last 10 entries</span>
          </div>
          
          <div className="h-48 w-full">
            {entries.length < 2 ? (
               <div className="h-full flex items-center justify-center text-stone-400 text-sm italic">
                  Not enough data yet. Log a few more moods!
               </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                   dataKey="time" 
                   tick={{fontSize: 10, fill: '#9ca3af'}} 
                   axisLine={false} 
                   tickLine={false} 
                   interval="preserveStartEnd"
                />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                   content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-800 text-white text-xs p-2 rounded-lg shadow-xl border border-stone-700">
                            <p className="font-bold flex items-center gap-1">{data.mood} {data.label}</p>
                            <p className="opacity-70 text-[10px]">{data.time}</p>
                          </div>
                        );
                      }
                      return null;
                   }}
                />
                <Area 
                   type="monotone" 
                   dataKey="score" 
                   stroke="#0d9488" 
                   strokeWidth={3} 
                   fillOpacity={1} 
                   fill="url(#colorScore)" 
                   activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-m3-surfaceContainerLow p-6 rounded-[28px] shadow-sm border border-m3-outline/50">
           <h3 className="text-lg font-medium text-m3-onSurfaceVariant mb-4 flex items-center gap-2">
            <Clock size={20} className="text-m3-primary" /> History
          </h3>
          <div className="relative space-y-0 pl-2">
            {/* Vertical Line */}
            <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-m3-outline"></div>

            {entries.slice().reverse().map((entry) => (
              <div key={entry.id} className="relative pl-8 pb-6 last:pb-0 group">
                {/* Timeline Dot */}
                <div className="absolute left-[3px] top-1 w-6 h-6 rounded-full bg-m3-surface border-2 border-m3-primary flex items-center justify-center z-10 text-[10px] group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-m3-primary"></div>
                </div>
                
                <div className="flex items-start justify-between">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-xl">{entry.mood}</span>
                         <span className="font-bold text-stone-700">{entry.label}</span>
                      </div>
                      {entry.note && (
                         <p className="text-sm text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100 inline-block max-w-full break-words">
                            {entry.note}
                         </p>
                      )}
                   </div>
                   <div className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-full whitespace-nowrap">
                      {entry.timestamp.toLocaleDateString() === new Date().toLocaleDateString() 
                         ? entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                         : entry.timestamp.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MoodTracker;