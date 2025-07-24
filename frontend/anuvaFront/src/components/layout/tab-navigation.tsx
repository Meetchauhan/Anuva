import { useLocation } from "wouter";
import { Home, BarChart3, Settings } from "lucide-react";

const tabs = [
  { id: "home", path: "/", label: "Home", icon: Home },
  { id: "analytics", path: "/analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", path: "/settings", label: "Settings", icon: Settings },
];

export default function TabNavigation() {
  const [location, navigate] = useLocation();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-[#1F5A42] text-[#1F5A42]' 
                    : 'border-transparent text-gray-500 hover:text-[#1F5A42] hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
