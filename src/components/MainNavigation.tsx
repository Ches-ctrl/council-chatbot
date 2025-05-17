
import { ChevronRight } from "lucide-react";

const NavigationItem = ({ title }: { title: string }) => {
  return (
    <div className="bg-council-blue text-white flex-1 flex justify-between items-center py-5 px-6 cursor-pointer hover:bg-blue-900 transition">
      <h3 className="font-medium text-lg">{title}</h3>
      <ChevronRight className="h-6 w-6" />
    </div>
  );
};

const MainNavigation = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <NavigationItem title="Pay for it" />
        <NavigationItem title="Report it" />
        <NavigationItem title="Apply for it" />
      </div>
    </div>
  );
};

export default MainNavigation;
