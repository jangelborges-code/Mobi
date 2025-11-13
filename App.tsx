
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import LeadsDashboard from './components/leads/LeadsDashboard';
import ToolkitView from './components/toolkit/ToolkitView';
import BlackboardView from './components/blackboard/BlackboardView';
import { Section, Lead } from './types';
import ConversationView from './components/leads/ConversationView';
import useMobiState from './hooks/useMobiState';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Toolkit');
  const mobiState = useMobiState();

  const renderSection = () => {
    if (mobiState.selectedLead) {
      return <ConversationView mobiState={mobiState} />;
    }

    switch (currentSection) {
      case 'Leads':
        return <LeadsDashboard mobiState={mobiState} />;
      case 'Toolkit':
        return <ToolkitView mobiState={mobiState} />;
      case 'Blackboard':
        return <BlackboardView mobiState={mobiState} />;
      default:
        return <LeadsDashboard mobiState={mobiState} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#e6e2df] text-black">
      <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} onLogoClick={() => mobiState.setSelectedLead(null)}/>
      <main className="flex-1 flex flex-col overflow-hidden pt-28">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;

// Forzando el redespliegue