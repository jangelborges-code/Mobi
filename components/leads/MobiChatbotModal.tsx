import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { Lead, MobiChatMessage } from '../../types';
import { getMobiChatbotResponse } from '../../services/geminiService';
import Spinner from '../common/Spinner';

interface MobiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  lead: Lead;
}

const MobiChatbotModal: React.FC<MobiChatbotModalProps> = ({ isOpen, onClose, initialPrompt, lead }) => {
  const [history, setHistory] = useState<MobiChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialPrompt && history.length === 0) {
      const initialAgentMessage: MobiChatMessage = { sender: 'agent', text: initialPrompt };
      setHistory([initialAgentMessage]);
      fetchMobiResponse([initialAgentMessage], initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPrompt]); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [history]);


  const fetchMobiResponse = async (currentHistory: MobiChatMessage[], newMessage: string) => {
    setIsLoading(true);
    try {
      const mobiResponseText = await getMobiChatbotResponse(currentHistory, newMessage, lead);
      const mobiMessage: MobiChatMessage = { sender: 'mobi', text: mobiResponseText };
      setHistory(prev => [...prev, mobiMessage]);
    } catch (error) {
      console.error("Error fetching Mobi response:", error);
      const errorMessage: MobiChatMessage = { sender: 'mobi', text: "Lo siento, no pude procesar tu solicitud." };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;
    const newAgentMessage: MobiChatMessage = { sender: 'agent', text: inputText };
    const updatedHistory = [...history, newAgentMessage];
    setHistory(updatedHistory);
    fetchMobiResponse(updatedHistory, inputText);
    setInputText('');
  };
  
  const handleClose = () => {
      setHistory([]);
      setInputText('');
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Habla con Mobi">
      <div className="flex flex-col h-[70vh] max-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 rounded-t-lg">
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'agent' ? 'bg-[#0d624e] text-white' : 'bg-white text-black shadow-sm'}`}>
                <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white text-black p-3 rounded-lg max-w-lg shadow-sm">
                <div className="flex items-center space-x-1">
                    <span className="text-sm">Mobi está pensando</span>
                    <Spinner />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-black/20 bg-white/50 rounded-b-lg">
          <div className="flex items-center bg-white rounded-full p-2 shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Haz una pregunta de seguimiento..."
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-black"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#ff5500] text-white p-3 rounded-full hover:bg-opacity-90 transition-transform duration-200 active:scale-95 disabled:bg-gray-400"
              disabled={isLoading || !inputText.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MobiChatbotModal;
