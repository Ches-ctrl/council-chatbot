
import { Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="bg-council-blue text-white py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Oxford City Council</h1>
            <p className="text-xs md:text-sm">Building a world-class city for everyone</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="flex items-center text-sm hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Do it online
          </a>
          <a href="#" className="flex items-center text-sm hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l.8 3H13a1 1 0 110 2h-3.2l.6 2.2a1 1 0 01-.9 1.4 1 1 0 01-1-.8L8 11H6.83l.8 3a1 1 0 11-1.93.5l-1.7-6a1 1 0 010-.74l1.71-6A1 1 0 016.83 2H7z" clipRule="evenodd" />
            </svg>
            Translate
          </a>
          <a href="#" className="flex items-center text-sm hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Newsletter
          </a>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Menu className="h-5 w-5 mr-1" />
            Menu
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
