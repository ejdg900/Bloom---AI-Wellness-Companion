import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToBloom, startChatSession } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasStarted) {
      startChatSession();
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: "Hi, I'm Bloom 🌸 I'm here to listen, support, and be a comforting presence whenever you need it.\n\nHow are you feeling today?",
          timestamp: new Date(),
        }
      ]);
      setHasStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToBloom(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-m3-surface relative">
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-m3-primary text-white' : 'bg-m3-secondaryContainer text-m3-onSecondaryContainer'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              {/* Bubble - M3 shapes */}
              <div
                className={`p-4 leading-relaxed shadow-sm text-[15px] ${
                  msg.role === 'user'
                    ? 'bg-m3-primary text-white rounded-[24px] rounded-br-sm'
                    : 'bg-m3-surfaceContainer text-slate-800 border border-slate-100 rounded-[24px] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex max-w-[85%] flex-row items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-m3-secondaryContainer text-m3-onSecondaryContainer flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="bg-white p-4 rounded-[24px] rounded-bl-sm border border-slate-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - M3 styling */}
      <div className="p-4 bg-m3-surfaceContainer border-t border-m3-outline absolute bottom-0 w-full left-0 z-10">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-m3-primary focus:bg-white transition-all resize-none text-slate-700 max-h-32 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="w-12 h-12 rounded-full bg-m3-primary hover:bg-teal-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md mb-0.5"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;