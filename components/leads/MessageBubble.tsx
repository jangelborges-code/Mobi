
import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  leadName: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, leadName }) => {
  const isAgent = message.sender === 'agent';
  const isMobi = message.sender === 'mobi-suggestion' || message.sender === 'mobi-image';

  if (isMobi) {
    return (
        <div className="flex items-center justify-center my-4">
            <div className="text-center p-3 bg-[#f29100]/20 border border-[#f29100] rounded-lg max-w-2xl">
                <p className="font-bold text-sm text-[#f29100] mb-1">Sugerencia de Mobi</p>
                <p className="text-black whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
  }

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end max-w-lg ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isAgent && (
           <img src={`https://i.pravatar.cc/32?u=${leadName}`} alt={leadName} className="w-8 h-8 rounded-full mr-2 self-start" />
        )}
        <div className={`p-3 rounded-lg ${isAgent ? 'bg-[#0d624e] text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'}`}>
          <p>{message.text}</p>
          <p className={`text-xs mt-1 ${isAgent ? 'text-white/70 text-right' : 'text-black/50 text-left'}`}>{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
