
import { Search } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
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
      
      {/* Search box */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-council-navy/90 p-8 rounded-sm max-w-3xl w-full mx-4">
          <h2 className="text-white text-2xl mb-4 text-center">How can we help?</h2>
          <div className="flex">
            <input 
              type="text"
              placeholder="Search..." 
              className="flex-grow px-4 py-3 rounded-l-sm focus:outline-none text-council-text"
            />
            <Button className="bg-council-blue hover:bg-blue-900 rounded-l-none px-5">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
