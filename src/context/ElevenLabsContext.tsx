import React, { createContext, useContext, useState, useCallback } from 'react';
import { Conversation } from '@11labs/client';
import { v4 as uuidv4 } from 'uuid';

interface ElevenLabsContextType {
  isRecording: boolean;
  isProcessingVoice: boolean;
  transcript: string;
  startElevenLabsConversation: () => Promise<void>;
  endElevenLabsConversation: () => Promise<void>;
  sendTextToElevenLabs: (text: string) => Promise<void>;
  onMessage: (callback: (message: { id: string, content: string, role: 'user' | 'assistant' }) => void) => void;
}

const ElevenLabsContext = createContext<ElevenLabsContextType | undefined>(undefined);

// Audio conversion utility
function convertFloat32ToInt16(buffer: Float32Array): ArrayBuffer {
  const int16Array = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32767));
  }
  return int16Array.buffer;
}

// Setup microphone processing
const setupMicrophoneProcessing = async (conversationId: string): Promise<() => void> => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1) as ScriptProcessorNode;
    
    source.connect(processor);
    processor.connect(audioContext.destination);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/conversations/${conversationId}/stream-input`, {
      method: 'GET',
      headers: {
        'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get streaming URL');
    }
    
    const data = await response.json();
    const websocketUrl = data.websocket_url;
    const socket = new WebSocket(websocketUrl);
    
    processor.onaudioprocess = (e) => {
      if (socket.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = convertFloat32ToInt16(inputData);
        socket.send(audioData);
      }
    };
    
    return () => {
      processor.disconnect();
      source.disconnect();
      socket.close();
      stream.getTracks().forEach(track => track.stop());
    };
  } catch (error) {
    console.error('Error setting up microphone processing:', error);
    return () => {};
  }
};

export const ElevenLabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [onMessageCallback, setOnMessageCallback] = useState<((message: { id: string, content: string, role: 'user' | 'assistant' }) => void) | null>(null);

  const startElevenLabsConversation = useCallback(async () => {
    try {
      setIsProcessingVoice(true);
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const agentId = import.meta.env.VITE_AGENT_ID;
      const conversationSession = await Conversation.startSession({
        agentId: agentId,
        onConnect: (event) => {
          console.log("Connected to ElevenLabs", event);
          setIsRecording(true);
          
          if (event.conversationId) {
            setupMicrophoneProcessing(event.conversationId);
          }
        },
        onDisconnect: () => {
          console.log("Disconnected from ElevenLabs");
          setIsRecording(false);
        },
        onError: (error) => {
          console.error("Error with ElevenLabs:", error);
          setIsProcessingVoice(false);
          setIsRecording(false);
        },
        onModeChange: (mode) => {
          setTranscript(mode.mode === 'speaking' ? 'AI is speaking...' : 'Listening...');
        },
        onMessage: (message: any) => {
          let messageText = "";
          let messageSource = "";
          
          if (typeof message === 'object') {
            if (message.message !== undefined) {
              messageText = message.message;
            }
            if (message.source !== undefined) {
              messageSource = message.source;
            }
            if (message.agent_response_event?.agent_response) {
              messageText = message.agent_response_event.agent_response;
              messageSource = 'agent';
            }
            if (message.user_transcription_event?.user_transcript) {
              messageText = message.user_transcription_event.user_transcript;
              messageSource = 'human';
            }
          }
          
          if (messageText && messageText.trim().length > 0) {
            const role = messageSource === 'human' || messageSource === 'user' ? 'user' : 'assistant';
            const newMessage = {
              id: uuidv4(),
              content: messageText,
              role: role as 'user' | 'assistant'
            };
            
            if (onMessageCallback) {
              onMessageCallback(newMessage);
            }
          }
        }
      });
      
      setConversation(conversationSession);
      setIsProcessingVoice(false);
      
    } catch (error) {
      console.error("Error starting ElevenLabs conversation:", error);
      setIsProcessingVoice(false);
      setIsRecording(false);
    }
  }, [onMessageCallback]);

  const endElevenLabsConversation = useCallback(async () => {
    if (conversation) {
      try {
        await conversation.endSession();
        setConversation(null);
        setIsRecording(false);
      } catch (error) {
        console.error("Error ending ElevenLabs conversation:", error);
      }
    }
  }, [conversation]);

  const sendTextToElevenLabs = useCallback(async (text: string) => {
    try {
      if (!conversation) {
        await startElevenLabsConversation();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (conversation) {
        await conversation.sendTextMessage(text);
      }
    } catch (error) {
      console.error("Error sending text to ElevenLabs:", error);
    }
  }, [conversation, startElevenLabsConversation]);

  const setOnMessage = useCallback((callback: (message: { id: string, content: string, role: 'user' | 'assistant' }) => void) => {
    setOnMessageCallback(() => callback);
  }, []);

  return (
    <ElevenLabsContext.Provider value={{
      isRecording,
      isProcessingVoice,
      transcript,
      startElevenLabsConversation,
      endElevenLabsConversation,
      sendTextToElevenLabs,
      onMessage: setOnMessage
    }}>
      {children}
    </ElevenLabsContext.Provider>
  );
};

export const useElevenLabs = (): ElevenLabsContextType => {
  const context = useContext(ElevenLabsContext);
  if (context === undefined) {
    throw new Error('useElevenLabs must be used within an ElevenLabsProvider');
  }
  return context;
}; 