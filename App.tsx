
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { ModuleId } from './types';
import { LEARNING_MODULES } from './constants';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(ModuleId.INTRODUCTION);

  const activeModule = LEARNING_MODULES.find(m => m.id === activeModuleId) || LEARNING_MODULES[0];

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-900 text-gray-200">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeModuleId={activeModuleId} onSelectModule={setActiveModuleId} />
        <main className="flex-1 overflow-y-auto">
          <MainContent module={activeModule} />
        </main>
      </div>
    </div>
  );
};

export default App;
