import React, { useState, useEffect, useRef } from 'react';
import { MobiState, Message, Lead } from '../../types';
import MessageBubble from './MessageBubble';
import MobiBubble from './MobiBubble';
import { generateLeadResponse, analyzeSentiment, getMobiSuggestions } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import MobiChatbotModal from './MobiChatbotModal';
import AddLeadModal from './AddLeadModal';

interface ConversationViewProps {
  mobiState: MobiState;
}

const ConversationView: React.FC<ConversationViewProps> = ({ mobiState }) => {
  const { selectedLead, addMessageToLead, updateLeadTemperature, setSelectedLead, updateLead } = mobiState;
  const [inputText, setInputText] = useState('');
  const [isLeadTyping, setIsLeadTyping] = useState(false);
  const [isMobiChatOpen, setIsMobiChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [selectedLead?.conversation]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedLead) return;

    const agentMessage: Omit<Message, 'id' | 'timestamp'> = { sender: 'agent', text: inputText };
    addMessageToLead(selectedLead.id, agentMessage);
    setInputText('');
    setIsLeadTyping(true);

    try {
      const leadResponseText = await generateLeadResponse(selectedLead, inputText);
      addMessageToLead(selectedLead.id, { sender: 'lead', text: leadResponseText });
      
      const newTemperature = await analyzeSentiment(leadResponseText);
      updateLeadTemperature(selectedLead.id, newTemperature);

    } catch (error) {
      console.error("Failed to get lead response or sentiment:", error);
      addMessageToLead(selectedLead.id, { sender: 'lead', text: 'Lo siento, tuve un problema. ¿Podemos continuar más tarde?' });
    } finally {
      setIsLeadTyping(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInitialChatPrompt(suggestion);
    setIsMobiChatOpen(true);
  };
  
  if (!selectedLead) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Selecciona un lead para ver la conversación.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-white/40 h-full">
        <header className="flex items-center p-4 bg-white/60 backdrop-blur-sm border-b border-black/10 z-10">
          <button onClick={() => setSelectedLead(null)} className="mr-4 p-2 rounded-full hover:bg-black/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <img src={`https://i.pravatar.cc/40?u=${selectedLead.id}`} alt={selectedLead.name} className="w-10 h-10 rounded-full mr-4" />
          <div className="flex-grow">
            <h2 className="text-lg font-bold">{selectedLead.name}</h2>
            <p className="text-sm text-black/60">
              {selectedLead.jobTitle && selectedLead.company 
                ? `${selectedLead.jobTitle} en ${selectedLead.company}`
                : selectedLead.project
              }
            </p>
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="p-2 rounded-full text-black/50 hover:bg-black/10 hover:text-black/90 transition-colors ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="space-y-4">
            {selectedLead.conversation.map((msg) => (
              <MessageBubble key={msg.id} message={msg} leadName={selectedLead.name} />
            ))}
            {isLeadTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black p-3 rounded-lg max-w-lg">
                  <div className="flex items-center space-x-1">
                      <span className="text-sm">Escribiendo</span>
                      <Spinner />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <MobiBubble onSuggestionClick={handleSuggestionClick} lead={selectedLead} mobiState={mobiState} />
        </div>

        <footer className="p-4 bg-white/60 backdrop-blur-sm border-t border-black/10">
          <div className="flex items-center bg-white rounded-full p-2 shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#0d624e] text-white p-3 rounded-full hover:bg-opacity-90 transition-transform duration-200 active:scale-95 disabled:bg-gray-400"
              disabled={isLeadTyping}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
      
      {isMobiChatOpen && (
        <MobiChatbotModal
          isOpen={isMobiChatOpen}
          onClose={() => setIsMobiChatOpen(false)}
          initialPrompt={initialChatPrompt}
          lead={selectedLead}
        />
      )}
      {isEditModalOpen && selectedLead && (
         <AddLeadModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            leadToEdit={selectedLead}
            onUpdateLead={updateLead}
            onAddLead={() => {}} // Dummy function, not used in edit mode
            onAddMultipleLeads={() => {}} // Dummy function, not used in edit mode
         />
      )}
    </>
  );
};

export default ConversationView;