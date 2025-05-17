
import React, { useState, useRef } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  text: string;
  sender: "user" | "system";
  timestamp: Date;
};

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start listening
      setIsListening(true);
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
        
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const speechResult = event.results[0][0].transcript;
          setInputValue(speechResult);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        console.error("Speech recognition not supported in this browser");
        setIsListening(false);
      }
    } else {
      // Stop listening
      setIsListening(false);
    }
    
    // Focus the input after toggling voice input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        text: inputValue.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      
      // Add user message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      console.log("Message sent:", inputValue);
      
      // Show the chat history if it's not already visible
      if (!showChat) {
        setShowChat(true);
      }
      
      // Clear the input
      setInputValue("");
      
      // Simulate system response
      setTimeout(() => {
        const systemResponse: Message = {
          text: "Thank you for your message. How can I assist you further?",
          sender: "system",
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, systemResponse]);
      }, 1000);
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
                {messages.map((message, index) => (
                  <div
                    key={index}
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
            >
              {inputValue ? (
                <Send className="h-5 w-5" />
              ) : (
                <Mic className={`h-5 w-5 ${isListening ? "animate-pulse text-red-500" : ""}`} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
