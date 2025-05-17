
import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/sonner";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messages.length && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start listening
      setIsListening(true);
      
      // Show the chat history if it's not already visible
      if (!showChat) {
        setShowChat(true);
        setIsFullscreen(true);
      }
      
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
          
          // Automatically submit the voice input
          handleSubmitWithMessage(speechResult);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
          toast.error("Speech recognition failed. Please try again.");
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        console.error("Speech recognition not supported in this browser");
        toast.error("Speech recognition is not supported in your browser.");
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

  const handleSubmitWithMessage = (message: string) => {
    if (message.trim()) {
      const newMessage: Message = {
        text: message.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      
      // Add user message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      console.log("Message sent:", message);
      
      // Show the chat history in fullscreen if it's not already visible
      if (!showChat) {
        setShowChat(true);
        setIsFullscreen(true);
      }
      
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

  const handleSubmit = () => {
    if (inputValue.trim()) {
      handleSubmitWithMessage(inputValue);
      // Clear the input
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSubmit();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/80' : 'h-[300px] md:h-[400px] overflow-hidden'}`}>
      {/* Background image - only shown when not in fullscreen */}
      {!isFullscreen && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/lovable-uploads/a13d805f-ed65-49b0-a3c2-ccbf1d0cb670.png')",
          }}
        />
      )}
      
      {/* Dark overlay - only shown when not in fullscreen */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      )}
      
      {/* Chat box */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={chatContainerRef}
          className={`
            bg-council-navy/90 p-4 md:p-8 rounded-sm transition-all duration-300
            ${isFullscreen ? 'h-full w-full max-w-full mx-0' : 'max-w-3xl w-full mx-4'} 
            ${showChat && !isFullscreen ? 'h-[85%]' : ''}
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl text-center flex-grow">How can we help?</h2>
            {showChat && (
              <Button 
                variant="ghost" 
                onClick={toggleFullscreen} 
                className="text-white hover:bg-white/10"
                size="icon"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            )}
          </div>
          
          {/* Chat history */}
          {showChat && messages.length > 0 && (
            <ScrollArea 
              className={`${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[calc(100%-110px)]'} mb-4 pr-4`} 
              ref={scrollAreaRef}
            >
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
          <div className="flex mt-auto">
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
              className={`rounded-l-none px-5 ${
                isListening 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-council-blue hover:bg-blue-900"
              }`}
              onClick={inputValue ? handleSubmit : handleVoiceInput}
            >
              {inputValue ? (
                <Send className="h-5 w-5" />
              ) : isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
