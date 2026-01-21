import React, { useState } from 'react';
import { MOODS } from '../constants';
import { MoodEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, Smile, Plus } from 'lucide-react';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (entry: MoodEntry) => void;
}

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

  // Prepare data for chart - simple count by label
  const chartData = MOODS.map(m => ({
    name: m.label,
    count: entries.filter(e => e.label === m.label).length,
    emoji: m.emoji,
    color: m.color
  }));

  const getBarColor = (label: string) => {
    switch(label) {
      case 'Happy': return '#facc15';
      case 'Calm': return '#14b8a6';
      case 'Neutral': return '#9ca3af';
      case 'Sad': return '#3b82f6';
      case 'Anxious': return '#a855f7';
      case 'Frustrated': return '#f97316';
      case 'Overwhelmed': return '#ef4444';
      default: return '#cbd5e1';
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-m3-surface pb-24">
      {/* Title */}
      <h2 className="text-2xl font-normal text-slate-800 mb-6 flex items-center gap-3 pl-2">
        <Smile className="text-m3-primary" size={28} /> 
        <span>Mood Check-in</span>
      </h2>

      {/* Input Section - M3 Elevated Card */}
      <div className="bg-m3-surfaceContainer p-5 rounded-3xl shadow-sm border border-m3-outline mb-6">
        <h3 className="text-lg font-medium text-slate-700 mb-4 pl-1">How are you feeling?</h3>
        
        {/* Mood Selection Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 gap-y-6 mb-6">
          {MOODS.map((m, idx) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(idx)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-200 ${
                selectedMood === idx
                  ? `${m.color} ring-2 ring-offset-2 ring-m3-primary scale-105 shadow-md`
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:shadow-sm'
              }`}
            >
              <span className="text-3xl mb-2 filter drop-shadow-sm">{m.emoji}</span>
              <span className="text-[11px] font-medium text-center leading-tight w-full break-words">{m.label}</span>
            </button>
          ))}
        </div>
        
        {selectedMood !== null && (
          <div className="animate-fade-in">
            <textarea
              className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-m3-primary focus:bg-white focus:ring-0 transition-all mb-4 resize-none text-slate-700"
              placeholder="What's making you feel this way? (Optional)"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="w-full py-3 bg-m3-primary text-onPrimary rounded-full font-medium transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={20} /> Save Entry
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Mood Overview Chart - M3 Elevated Card */}
        <div className="bg-m3-surfaceContainer p-5 rounded-3xl shadow-sm border border-m3-outline">
          <h3 className="text-lg font-medium text-slate-700 mb-2 pl-1">
             Mood Overview
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Corrected margins and added padding to XAxis to prevent clipping/overlapping */}
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 25 }}>
                <XAxis 
                  dataKey="emoji" 
                  tick={{fontSize: 22}} 
                  axisLine={false} 
                  tickLine={false} 
                  interval={0} 
                  dy={10}
                  padding={{ left: 15, right: 15 }}
                />
                <YAxis hide width={0} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9', radius: 8}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Entries - M3 Elevated Card */}
        <div className="bg-m3-surfaceContainer p-5 rounded-3xl shadow-sm border border-m3-outline">
           <h3 className="text-lg font-medium text-slate-700 mb-4 pl-1 flex items-center gap-2">
            <Calendar size={20} className="text-m3-primary" /> Recent Entries
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {entries.slice().reverse().map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 rounded-2xl bg-m3-surface border border-slate-100/50">
                <div className="text-2xl pt-0.5">{entry.mood}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <span className="font-medium text-slate-800 text-sm">{entry.label}</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 sm:mt-0 font-medium">
                      {entry.timestamp.toLocaleDateString()} • {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  {entry.note && <p className="text-xs text-slate-600 break-words leading-relaxed">{entry.note}</p>}
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