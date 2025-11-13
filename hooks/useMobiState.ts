import { useState, useCallback } from 'react';
import { Lead, Objection, Temperature, Message, MobiState, ProjectResource } from '../types';
import { INITIAL_LEADS, INITIAL_OBJECTIONS, INITIAL_RESOURCES } from '../constants';

const useMobiState = (): MobiState => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [objections, setObjections] = useState<Objection[]>(INITIAL_OBJECTIONS);
  const [resources, setResources] = useState<ProjectResource[]>(INITIAL_RESOURCES);

  const handleSetSelectedLead = useCallback((lead: Lead | null) => {
    setSelectedLead(lead);
  }, []);

  const addMessageToLead = useCallback((leadId: number, message: Omit<Message, 'id' | 'timestamp'>) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          const newMessage: Message = {
            ...message,
            id: lead.conversation.length + 1,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          };
          const updatedConversation = [...lead.conversation, newMessage];
          const updatedLead = { ...lead, conversation: updatedConversation };
          
          if(selectedLead && selectedLead.id === leadId) {
            setSelectedLead(updatedLead);
          }

          return updatedLead;
        }
        return lead;
      })
    );
  }, [selectedLead]);
  
  const updateLeadTemperature = useCallback((leadId: number, temperature: Temperature) => {
      setLeads(prevLeads =>
          prevLeads.map(lead => {
              if (lead.id === leadId) {
                  const updatedLead = { ...lead, temperature };
                  if (selectedLead && selectedLead.id === leadId) {
                      setSelectedLead(updatedLead);
                  }
                  return updatedLead;
              }
              return lead;
          })
      );
  }, [selectedLead]);

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'conversation'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now(),
      conversation: [],
    };
    setLeads(prev => [...prev, newLead]);
  }, []);

  const addMultipleLeads = useCallback((leadsData: Omit<Lead, 'id' | 'conversation'>[]) => {
    const newLeads: Lead[] = leadsData.map((leadData, index) => ({
      ...leadData,
      id: Date.now() + index,
      conversation: [],
    }));
    setLeads(prev => [...prev, ...newLeads]);
  }, []);

  const addObjection = useCallback((objection: Omit<Objection, 'id'>) => {
    setObjections(prev => [
      ...prev,
      { ...objection, id: Date.now() },
    ]);
  }, []);

  const updateObjection = useCallback((updatedObjection: Objection) => {
    setObjections(prev =>
      prev.map(obj => (obj.id === updatedObjection.id ? updatedObjection : obj))
    );
  }, []);

  const deleteObjection = useCallback((objectionId: number) => {
    setObjections(prev => prev.filter(obj => obj.id !== objectionId));
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads(prevLeads =>
        prevLeads.map(lead =>
            lead.id === updatedLead.id ? updatedLead : lead
        )
    );
    if (selectedLead && selectedLead.id === updatedLead.id) {
        setSelectedLead(updatedLead);
    }
  }, [selectedLead]);

  return {
    leads,
    selectedLead,
    objections,
    resources,
    setSelectedLead: handleSetSelectedLead,
    addMessageToLead,
    updateLeadTemperature,
    addLead,
    addMultipleLeads,
    addObjection,
    updateObjection,
    deleteObjection,
    updateLead,
  };
};

export default useMobiState;