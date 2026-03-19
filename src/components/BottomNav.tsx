import { Home, Calendar, Settings2 } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'routine', label: 'Routine', icon: Calendar },
    { id: 'manage', label: 'Manage', icon: Settings2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-green/10 px-6 py-3 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-earth-green' : 'text-earth-muted'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
