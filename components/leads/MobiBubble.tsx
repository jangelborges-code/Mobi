import React, { useState, useEffect } from 'react';
import { Lead, Objection } from '../../types';
import { getMobiSuggestions, generateObjectionResponse } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';

interface MobiBubbleProps {
    lead: Lead;
    mobiState: any;
    onSuggestionClick: (suggestion: string) => void;
}

type View = 'closed' | 'menu' | 'suggestions' | 'objections' | 'resources';

const MobiBubble: React.FC<MobiBubbleProps> = ({ lead, mobiState, onSuggestionClick }) => {
  const [view, setView] = useState<View>('closed');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [objectionResponses, setObjectionResponses] = useState<Record<number, {loading: boolean, response: string}>>({});
  
  // State for objection modal
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [newObjectionTitle, setNewObjectionTitle] = useState('');
  const [newObjectionArgs, setNewObjectionArgs] = useState('');

  const handleBubbleClick = async () => {
    if (view !== 'closed') {
        setView('closed');
    } else {
        setView('menu');
    }
  };

  const handleGetSuggestions = async () => {
      setView('suggestions');
      setIsLoading(true);
      try {
        const newSuggestions = await getMobiSuggestions(lead, 2);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Failed to get suggestions", error);
        setSuggestions(["Error al cargar sugerencias."]);
      } finally {
        setIsLoading(false);
      }
  };

  const handleGetObjectionResponse = async (objection: Objection) => {
    setObjectionResponses(prev => ({ ...prev, [objection.id]: { loading: true, response: '' } }));
    try {
        const response = await generateObjectionResponse(lead, objection);
        setObjectionResponses(prev => ({ ...prev, [objection.id]: { loading: false, response } }));
    } catch (error) {
        console.error('Failed to get objection response', error);
        setObjectionResponses(prev => ({ ...prev, [objection.id]: { loading: false, response: 'Error al generar respuesta.' } }));
    }
  }
  
  const handleSaveObjection = () => {
      if (!newObjectionTitle.trim() || !newObjectionArgs.trim()) return;
      const argsArray = newObjectionArgs.split('\n').filter(arg => arg.trim() !== '');
      mobiState.addObjection({ title: newObjectionTitle, arguments: argsArray });
      setIsObjectionModalOpen(false);
      setNewObjectionTitle('');
      setNewObjectionArgs('');
  }

  const projectResources = mobiState.resources.filter((r: any) => r.project === lead.project);

  const renderContent = () => {
      switch (view) {
          case 'menu':
              return (
                  <div className="space-y-2">
                      <button onClick={handleGetSuggestions} className="w-full text-left text-sm p-3 rounded-md bg-black/5 hover:bg-black/10 transition-colors duration-200 text-black font-semibold">Generar Sugerencias</button>
                      <button onClick={() => setView('objections')} className="w-full text-left text-sm p-3 rounded-md bg-black/5 hover:bg-black/10 transition-colors duration-200 text-black font-semibold">Manual de Objeciones</button>
                      <button onClick={() => setView('resources')} className="w-full text-left text-sm p-3 rounded-md bg-black/5 hover:bg-black/10 transition-colors duration-200 text-black font-semibold">Abrir Recursos</button>
                  </div>
              );
          case 'suggestions':
              return (
                  <div>
                      <button onClick={() => setView('menu')} className="text-xs text-black/60 mb-2 hover:underline">‹ Volver al menú</button>
                      {isLoading ? <div className="flex justify-center p-4"><Spinner /></div> : (
                          <ul className="space-y-2">
                              {suggestions.map((s, i) => <li key={i}><button onClick={() => { onSuggestionClick(s); setView('closed'); }} className="w-full text-left text-sm p-2 rounded-md bg-black/5 hover:bg-black/10 transition-colors duration-200 text-black">{s}</button></li>)}
                          </ul>
                      )}
                  </div>
              );
          case 'objections':
              return (
                  <div className="space-y-2">
                      <button onClick={() => setView('menu')} className="text-xs text-black/60 mb-2 hover:underline">‹ Volver al menú</button>
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {mobiState.objections.map((objection: Objection) => (
                          <details key={objection.id} className="bg-black/5 rounded-md text-sm">
                              <summary className="font-semibold p-2 cursor-pointer">{objection.title}</summary>
                              <div className="p-2 border-t border-black/10">
                                  <p className="font-semibold text-xs mb-1 text-black/70">Argumentos Generales:</p>
                                  <ul className="list-disc pl-5 text-black/80 text-xs space-y-1 mb-2">
                                    {objection.arguments.map((arg, i) => <li key={i}>{arg}</li>)}
                                  </ul>
                                  {objectionResponses[objection.id]?.response && (
                                    <div className="bg-[#ff5500]/20 p-2 rounded-md mt-2 text-xs">
                                        <p className="font-bold text-[#ff5500]">Sugerencia Personalizada:</p>
                                        <p className="text-black">{objectionResponses[objection.id].response}</p>
                                    </div>
                                  )}
                                  <button onClick={() => handleGetObjectionResponse(objection)} disabled={objectionResponses[objection.id]?.loading} className="text-xs bg-[#ff5500] text-white px-2 py-1 rounded-md hover:bg-opacity-80 transition mt-2 w-full flex items-center justify-center">
                                    {objectionResponses[objection.id]?.loading ? <Spinner /> : "Generar respuesta de IA"}
                                  </button>
                              </div>
                          </details>
                      ))}
                      </div>
                      <button onClick={() => setIsObjectionModalOpen(true)} className="w-full text-center text-sm p-2 mt-2 rounded-md bg-[#0d624e] text-white hover:bg-opacity-90 transition-colors duration-200 font-semibold">+ Añadir Objeción</button>
                  </div>
              );
          case 'resources':
               return (
                  <div>
                      <button onClick={() => setView('menu')} className="text-xs text-black/60 mb-2 hover:underline">‹ Volver al menú</button>
                      <p className="font-semibold mb-2 text-sm">Recursos para: {lead.project}</p>
                      <ul className="space-y-1 max-h-48 overflow-y-auto pr-2">
                        {projectResources.map((res: any) => (
                          <li key={res.id}>
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs p-2 rounded-md bg-black/5 hover:bg-black/10 transition-colors duration-200 text-black">
                              📄 <span className="ml-2 underline">{res.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                  </div>
              );
          default: return null;
      }
  }

  return (
    <>
    <div className="fixed bottom-28 right-8 z-20">
      {view !== 'closed' && (
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-4 mb-3 w-72 border border-black/10 animate-fade-in-up">
          <h4 className="font-bold text-black mb-2 flex justify-between items-center">
            <span>Asistente Mobi</span>
            <button onClick={() => setView(view === 'menu' ? 'closed' : 'menu')} className="text-black/50 hover:text-black">&times;</button>
          </h4>
          {renderContent()}
        </div>
      )}

      <button
        onClick={handleBubbleClick}
        className="w-16 h-16 bg-[#ff5500] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-300"
      >
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18 V10 L12 3 L20 10 V18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18 C 8 22, 16 22, 20 18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 13h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13h.01" />
        </svg>
      </button>
    </div>
    <Modal isOpen={isObjectionModalOpen} onClose={() => setIsObjectionModalOpen(false)} title="Nueva Objeción">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-black/80 mb-1">Título de la Objeción</label>
                <input type="text" value={newObjectionTitle} onChange={(e) => setNewObjectionTitle(e.target.value)} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500]" placeholder="Ej: Precio elevado" />
            </div>
            <div>
                <label className="block text-sm font-medium text-black/80 mb-1">Contra-argumentos (uno por línea)</label>
                <textarea value={newObjectionArgs} onChange={(e) => setNewObjectionArgs(e.target.value)} rows={5} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500]" placeholder="Ej: Hablemos del valor a largo plazo..."></textarea>
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={() => setIsObjectionModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancelar</button>
                <button onClick={handleSaveObjection} className="px-4 py-2 rounded-md bg-[#0d624e] text-white hover:bg-opacity-90">Guardar</button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default MobiBubble;