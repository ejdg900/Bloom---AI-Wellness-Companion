import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, Volume2, Square, ArrowUp } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToBloom, startChatSession, speakMessage, stopSpeaking } from '../services/geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const CONVERSATION_STARTERS = [
  "I'm feeling overwhelmed",
  "I can't sleep",
  "I need some motivation",
  "Help me calm down",
  "I just want to vent"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isSpeakingLoading, setIsSpeakingLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Ensure the backend session is active (preserves context if already active)
    startChatSession();

    // Only add greeting if history is empty
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: "Hi, I'm Bloom 🌸 I'm here to listen, support, and be a comforting presence whenever you need it.\n\nHow are you feeling today?",
          timestamp: new Date(),
        }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NEW: Effect to trigger AI response if the last message is from the USER and we aren't loading.
  // This handles the "Discuss with Bloom" feature where the App component pushes a user message to history.
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'user') {
            // Trigger API call for this message
            triggerResponse(lastMsg.text);
        }
    }
  }, [messages, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Extracted API logic to be reusable
  const triggerResponse = async (text: string) => {
    setIsLoading(true);
    try {
      const responseText = await sendMessageToBloom(text);
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

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || isLoading) return;

    // Stop any current speech when sending new message
    stopSpeaking();
    setSpeakingId(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // The useEffect above will catch the new message and trigger triggerResponse
  };

  const handleSpeak = async (msg: Message) => {
    if (speakingId === msg.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }

    stopSpeaking();
    setSpeakingId(msg.id);
    setIsSpeakingLoading(true);

    try {
      await speakMessage(msg.text);
      setSpeakingId(null); // Reset after playback finishes
    } catch (error) {
      console.error("Speech failed", error);
      setSpeakingId(null);
    } finally {
      setIsSpeakingLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-m3-surface relative w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6 w-full custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex max-w-[85%] md:max-w-[80%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } items-end gap-2 sm:gap-3 group`}
            >
              {/* Avatar */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-m3-primary text-white' 
                    : 'bg-m3-secondaryContainer text-m3-onSecondaryContainer'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              {/* Bubble & Actions Container */}
              <div className="flex flex-col gap-1 min-w-0">
                <div
                  className={`px-4 py-3 sm:px-5 sm:py-4 leading-relaxed shadow-sm text-[15px] font-body break-words whitespace-pre-wrap min-w-0 ${
                    msg.role === 'user'
                      ? 'bg-m3-primary text-white rounded-[24px] rounded-br-sm'
                      : 'bg-m3-surfaceContainer text-stone-800 border border-stone-100 rounded-[24px] rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Read Aloud Button (Only for Model) */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleSpeak(msg)}
                    disabled={isSpeakingLoading && speakingId === msg.id}
                    className="self-start ml-2 p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors flex items-center gap-1.5"
                    title="Read Aloud"
                  >
                    {speakingId === msg.id ? (
                       isSpeakingLoading ? (
                         // Loading Spinner
                         <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin"></div>
                       ) : (
                         // Stop Icon
                         <>
                           <Square size={14} fill="currentColor" />
                           <span className="text-[10px] font-bold">Stop</span>
                         </>
                       )
                    ) : (
                       // Play Icon
                       <>
                         <Volume2 size={14} />
                         <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
                       </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="flex max-w-[85%] flex-row items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-m3-secondaryContainer text-m3-onSecondaryContainer flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="bg-white px-5 py-4 rounded-[24px] rounded-bl-sm border border-stone-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Chips (Only show if only 1 message exists - the greeting) */}
        {!isLoading && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-2 animate-fade-in mt-4">
             {CONVERSATION_STARTERS.map((starter) => (
               <button
                 key={starter}
                 onClick={() => handleSend(starter)}
                 className="px-4 py-2 bg-white border border-m3-primary/20 text-m3-primary text-sm font-medium rounded-full hover:bg-m3-primary hover:text-white transition-colors active:scale-95 shadow-sm"
               >
                 {starter}
               </button>
             ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full z-20">
        {/* Gradient fade above input */}
        <div className="h-6 bg-gradient-to-t from-m3-surfaceContainer to-transparent w-full pointer-events-none"></div>
        
        {/* Added pb-14 to clear the floating SOS button from the nav bar */}
        <div className="bg-m3-surfaceContainer border-t border-m3-outline p-4 pb-14 w-full">
            <div className="max-w-4xl mx-auto relative flex items-end gap-2 w-full">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-stone-100 rounded-[24px] px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-m3-primary focus:bg-white transition-all resize-none text-stone-700 max-h-32 min-h-[52px] text-sm font-body custom-scrollbar"
                rows={1}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputText.trim()}
                className="w-12 h-[52px] rounded-full bg-m3-primary hover:bg-teal-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0 active:scale-95"
              >
                <ArrowUp size={24} strokeWidth={2.5} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;