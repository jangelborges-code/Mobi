
import React from 'react';
import { Section } from '../../types';

interface SidebarProps {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  onLogoClick: () => void;
}

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: React.ReactNode } = {
        Leads: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 01-3.712 0M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>,
        Toolkit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
        Blackboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    };
    return icons[name] || null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setCurrentSection, onLogoClick }) => {
  const navItems: Section[] = ['Leads', 'Toolkit', 'Blackboard'];

  return (
    <header className="w-full flex justify-center py-3 absolute top-0 left-0 right-0 z-30">
      <nav className="w-full max-w-md sm:max-w-lg md:max-w-3xl bg-white/30 backdrop-blur-lg rounded-full shadow-2xl border border-black/10 flex items-center justify-between p-3">
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={onLogoClick}>
          <div className="bg-[#ff5500] p-2 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18 V10 L12 3 L20 10 V18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18 C 8 22, 16 22, 20 18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 13h.01" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13h.01" />
            </svg>
          </div>
          <h1 className="text-xl font-bold ml-3 text-gray-800 hidden sm:block">Mobi</h1>
        </div>
        <ul className="flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => setCurrentSection(item)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentSection === item ? 'bg-black/10 text-gray-900' : 'text-gray-700 hover:bg-black/10 hover:text-gray-900'
                }`}
              >
                <NavIcon name={item} />
                <span className="hidden md:block">{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Sidebar;