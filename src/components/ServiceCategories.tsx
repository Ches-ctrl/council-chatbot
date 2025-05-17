
import { Trash2, PoundSterling, Car, Users, Building, Store, Stethoscope } from "lucide-react";

const ServiceCategory = ({ 
  title, 
  links, 
  icon: Icon 
}: { 
  title: string; 
  links: { text: string; url: string }[];
  icon: React.ElementType;
}) => {
  return (
    <div className="border border-gray-300 p-6 flex-1">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <Icon className="h-8 w-8 text-council-text" />
        </div>
        <h3 className="text-lg font-semibold text-council-text">{title}</h3>
      </div>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} className="text-council-link hover:underline">
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ServiceCategories = () => {
  const categories = [
    {
      title: "Recycling and Waste",
      icon: Trash2,
      links: [
        { text: "Find your collection day", url: "#" },
        { text: "What goes in each bin", url: "#" },
        { text: "Report missed bin collection", url: "#" }
      ]
    },
    {
      title: "Council Tax",
      icon: PoundSterling,
      links: [
        { text: "Pay your Council Tax", url: "#" },
        { text: "Tell us when you move", url: "#" },
        { text: "Apply for Student Exemption", url: "#" }
      ]
    },
    {
      title: "Parking and Travel",
      icon: Car,
      links: [
        { text: "Park and Ride", url: "#" },
        { text: "Car parks", url: "#" },
        { text: "Cycling", url: "#" }
      ]
    },
    {
      title: "Jobs",
      icon: Users,
      links: [
        { text: "Apply for a job", url: "#" },
        { text: "Advice on applying", url: "#" },
        { text: "Benefits of working for us", url: "#" }
      ]
    },
    {
      title: "Housing",
      icon: Building,
      links: [
        { text: "Apply for housing", url: "#" },
        { text: "Housing advice", url: "#" },
        { text: "Report housing repairs", url: "#" }
      ]
    },
    {
      title: "Planning and Building Control",
      icon: Building,
      links: [
        { text: "Apply for planning permission", url: "#" },
        { text: "Building regulations", url: "#" },
        { text: "View planning applications", url: "#" }
      ]
    },
    {
      title: "Business and Economy",
      icon: Store,
      links: [
        { text: "Business rates", url: "#" },
        { text: "Licenses and permits", url: "#" },
        { text: "Markets", url: "#" }
      ]
    },
    {
      title: "Environmental Health",
      icon: Stethoscope,
      links: [
        { text: "Report noise problems", url: "#" },
        { text: "Food safety", url: "#" },
        { text: "Air quality", url: "#" }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <ServiceCategory 
            key={index} 
            title={category.title} 
            links={category.links} 
            icon={category.icon} 
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
