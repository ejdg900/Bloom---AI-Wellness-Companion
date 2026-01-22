import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { BLOOM_SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Audio Context Singleton
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

const initializeAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const startChatSession = () => {
  initializeAI();
  if (!ai) throw new Error("AI not initialized");

  if (chatSession) {
    return chatSession;
  }

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

// --- Text-to-Speech Logic ---

export const stopSpeaking = () => {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      // Ignore if already stopped
    }
    currentSource = null;
  }
};

export const speakMessage = async (text: string): Promise<void> => {
  initializeAI();
  if (!ai) throw new Error("AI not initialized");

  // Stop any currently playing audio
  stopSpeaking();

  try {
    // Call Gemini 2.5 Flash TTS
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' is a warm, balanced voice suitable for a wellness coach
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    await playAudio(base64Audio);

  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// --- Audio Helper Functions ---

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, // Gemini TTS output is 24kHz
    });
  }
  // Ensure context is running (it can be suspended by browsers if no user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

const playAudio = async (base64String: string) => {
  const ctx = getAudioContext();
  const audioData = base64ToUint8Array(base64String);
  
  // Gemini sends raw PCM (1 channel, 24kHz). We must decode it manually for Web Audio API.
  const audioBuffer = await decodePCM(audioData, ctx);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start();
  
  currentSource = source;

  return new Promise<void>((resolve) => {
    source.onended = () => {
      currentSource = null;
      resolve();
    };
  });
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodePCM = (data: Uint8Array, ctx: AudioContext): AudioBuffer => {
  const inputSampleRate = 24000;
  // Int16Array view of the underlying buffer
  const pcm16 = new Int16Array(data.buffer, data.byteOffset, data.length / 2);
  const frameCount = pcm16.length;
  
  // Create an empty buffer
  const audioBuffer = ctx.createBuffer(1, frameCount, inputSampleRate);
  const channelData = audioBuffer.getChannelData(0);

  // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = pcm16[i] / 32768.0;
  }

  return audioBuffer;
};