
import React, { useState, useRef } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      console.log("Message sent:", inputValue);
      // Here you would typically send the message to a backend
      // For now we'll just log it and clear the input
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
        <div className="bg-council-navy/90 p-8 rounded-sm max-w-3xl w-full mx-4">
          <h2 className="text-white text-2xl mb-4 text-center">How can we help?</h2>
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
