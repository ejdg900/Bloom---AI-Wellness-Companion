import { GoogleGenAI, Chat } from "@google/genai";
import { BLOOM_SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initializeAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const startChatSession = () => {
  initializeAI();
  if (!ai) throw new Error("AI not initialized");

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: BLOOM_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });

  return chatSession;
};

export const sendMessageToBloom = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }

  if (!chatSession) {
    throw new Error("Failed to start chat session");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm having trouble responding right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now. Let's take a deep breath and try again in a moment.";
  }
};
