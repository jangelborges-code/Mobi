
import React, { useState } from 'react';
import { MobiState } from '../../types';
import DreamVisualizer from './DreamVisualizer';
import ObjectionManual from './ObjectionManual';
import MobiDesignView from './mobidesign/MobiDesignView';

interface ToolkitViewProps {
  mobiState: MobiState;
}

type ToolkitTab = 'visualizer' | 'objections' | 'closing' | 'mobidesign';

const ToolkitView: React.FC<ToolkitViewProps> = ({ mobiState }) => {
  const [activeTab, setActiveTab] = useState<ToolkitTab>('visualizer');

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-black">Toolkit</h1>
        <p className="text-black/70 mt-1">Tu arsenal de herramientas creativas y de conocimiento.</p>
      </header>

      <div className="border-b border-black/20 mb-6">
        <nav className="-mb-px flex space-x-6 flex-wrap">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'visualizer' ? 'border-[#ff5500] text-[#ff5500]' : 'border-transparent text-black/60 hover:text-black'}`}
          >
            Visualizador de Sueños
          </button>
          <button
            onClick={() => setActiveTab('objections')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'objections' ? 'border-[#ff5500] text-[#ff5500]' : 'border-transparent text-black/60 hover:text-black'}`}
          >
            Manual de Objeciones
          </button>
           <button
            onClick={() => setActiveTab('closing')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'closing' ? 'border-[#ff5500] text-[#ff5500]' : 'border-transparent text-black/60 hover:text-black'}`}
          >
            Argumentario de Cierre
          </button>
          <button
            onClick={() => setActiveTab('mobidesign')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'mobidesign' ? 'border-[#ff5500] text-[#ff5500]' : 'border-transparent text-black/60 hover:text-black'}`}
          >
            Mobi Design
          </button>
        </nav>
      </div>

      <div className="flex-1">
        {activeTab === 'visualizer' && <DreamVisualizer mobiState={mobiState} />}
        {activeTab === 'objections' && <ObjectionManual mobiState={mobiState} />}
        {activeTab === 'mobidesign' && <MobiDesignView />}
        {activeTab === 'closing' && (
             <div className="bg-white/50 p-6 rounded-lg shadow-md border border-black/10">
                <h2 className="text-2xl font-bold mb-4 text-[#0d624e]">Técnicas de Cierre Efectivas</h2>
                <ul className="list-disc pl-5 space-y-3 text-black">
                    <li><strong>Cierre Directo:</strong> "¿Basado en lo que hemos visto, están listos para hacer la oferta?"</li>
                    <li><strong>Cierre por Alternativa:</strong> "¿Prefieren el departamento con vista al parque o el que tiene balcón más grande?"</li>
                    <li><strong>Cierre de Benjamin Franklin:</strong> "Hagamos una lista de pros y contras. Verás que los beneficios superan ampliamente las dudas."</li>
                    <li><strong>Cierre por Escasez:</strong> "Este es el último departamento con esta orientación, y tenemos otra visita agendada para la tarde."</li>
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default ToolkitView;