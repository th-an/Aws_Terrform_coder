
import React from 'react';
import { LEARNING_MODULES } from '../constants';
import { LearningModule, ModuleId } from '../types';

interface SidebarProps {
  activeModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule }) => {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 p-4 space-y-2">
      <h2 className="px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Modules</h2>
      <nav>
        {LEARNING_MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors duration-200 ${
              activeModuleId === module.id
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
          >
            <module.icon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{module.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
