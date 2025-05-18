
import React, { useState, useRef, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useElevenLabs } from "@/context/ElevenLabsContext";

type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isRecording,
    isProcessingVoice,
    transcript,
    startElevenLabsConversation,
    endElevenLabsConversation,
    sendTextToElevenLabs,
    onMessage
  } = useElevenLabs();

  // Set up message handler
  useEffect(() => {
    onMessage((message) => {
      const newMessage: Message = {
        id: message.id,
        text: message.content,
        sender: message.role,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Show chat if not already visible
      if (!showChat) {
        setShowChat(true);
      }
    });
  }, [onMessage, showChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      await endElevenLabsConversation();
    } else {
      await startElevenLabsConversation();
    }
  };

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      // Add user message immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: inputValue.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Show chat if not already visible
      if (!showChat) {
        setShowChat(true);
      }
      
      // Send to ElevenLabs
      await sendTextToElevenLabs(inputValue.trim());
      
      // Clear input
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lovable-uploads/a13d805f-ed65-49b0-a3c2-ccbf1d0cb670.png')",
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      
      {/* Chat box */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`bg-council-navy/90 p-8 rounded-sm max-w-3xl w-full mx-4 transition-all duration-300 ${showChat ? 'h-[85%]' : ''}`}>
          <h2 className="text-white text-2xl mb-4 text-center">How can we help?</h2>
          
          {/* Chat history */}
          {showChat && messages.length > 0 && (
            <ScrollArea className="h-[calc(100%-110px)] mb-4 pr-4" ref={scrollAreaRef}>
              <div className="flex flex-col space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-council-blue/90 text-white self-end"
                        : "bg-gray-700/80 text-white self-start"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {/* Invisible div at the end to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
          
          {/* Input area */}
          <div className="flex">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..." 
              className="flex-grow px-4 py-3 rounded-l-sm focus:outline-none text-council-text"
            />
            <Button 
              className="bg-council-blue hover:bg-blue-900 rounded-l-none px-5"
              onClick={inputValue ? handleSubmit : handleVoiceInput}
              disabled={isProcessingVoice}
            >
              {inputValue ? (
                <Send className="h-5 w-5" />
              ) : (
                <Mic className={`h-5 w-5 ${isRecording ? "animate-pulse text-red-500" : ""}`} />
              )}
            </Button>
          </div>
          
          {/* Voice status */}
          {isRecording && (
            <div className="flex items-center justify-center mt-2 space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-gray-300 text-sm sm:text-base font-medium">
                {isProcessingVoice ? 'Connecting...' : transcript ? `"${transcript}"` : 'Voice mode active'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
