import React from 'react';
import { Lead, Temperature } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onSelect: () => void;
  onEdit: (event: React.MouseEvent) => void;
}

const temperatureColors: { [key in Temperature]: string } = {
  [Temperature.Hot]: 'bg-red-500',
  [Temperature.Warm]: 'bg-yellow-500',
  [Temperature.Cold]: 'bg-blue-500',
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, onEdit }) => {
  return (
    <div 
        onClick={onSelect}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-black/10 flex flex-col justify-between"
    >
        <div>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-black flex-1 mr-2">{lead.name}</h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={onEdit} className="p-1 rounded-full text-black/40 hover:bg-black/10 hover:text-black/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                    </button>
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${temperatureColors[lead.temperature]}`}>
                        {lead.temperature}
                    </span>
                </div>
            </div>
            <p className="text-sm text-black/60 mb-4">{lead.project}</p>
        </div>
        <div className="mt-auto">
            <p className="text-xs text-black/80 bg-black/5 p-2 rounded-md">
                Último mensaje: "{lead.conversation[lead.conversation.length - 1]?.text}"
            </p>
        </div>
    </div>
  );
};

export default LeadCard;