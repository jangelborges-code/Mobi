import React, { useState } from 'react';
import { MobiState, Temperature, Lead } from '../../types';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';

interface LeadsDashboardProps {
  mobiState: MobiState;
}

const LeadsDashboard: React.FC<LeadsDashboardProps> = ({ mobiState }) => {
  const [activeFilter, setActiveFilter] = useState<Temperature | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);


  const handleOpenAddModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLeadToEdit(null); // Ensure edit state is cleared on close
  };

  const filteredLeads = mobiState.leads.filter(lead => {
    if (activeFilter === 'All') {
      return true;
    }
    return lead.temperature === activeFilter;
  });

  const filterOptions: {label: string, value: Temperature | 'All'}[] = [
    { label: 'Todos', value: 'All' },
    { label: Temperature.Hot, value: Temperature.Hot },
    { label: Temperature.Warm, value: Temperature.Warm },
    { label: Temperature.Cold, value: Temperature.Cold },
  ];

  return (
    <>
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-black">Leads Activos</h1>
            <p className="text-black/70 mt-1">Gestiona y nutre tus conversaciones aquí.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#0d624e] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Añadir Lead</span>
          </button>
        </header>

        <div className="mb-6 flex items-center space-x-2 flex-wrap">
          <span className="text-black/70 font-medium mr-2 mb-2">Filtrar por temperatura:</span>
          {filterOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 mb-2 ${
                activeFilter === value
                  ? 'bg-[#0d624e] text-white shadow'
                  : 'bg-white/60 text-black/80 hover:bg-black/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onSelect={() => mobiState.setSelectedLead(lead)} 
                onEdit={(e) => {
                  e.stopPropagation();
                  handleOpenEditModal(lead);
                }}
              />
            ))
          ) : (
            <p className="text-black/70 col-span-full">No se encontraron leads con el filtro seleccionado.</p>
          )}
        </div>
      </div>
      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAddLead={mobiState.addLead}
        onAddMultipleLeads={mobiState.addMultipleLeads}
        leadToEdit={leadToEdit}
        onUpdateLead={mobiState.updateLead}
      />
    </>
  );
};

export default LeadsDashboard;