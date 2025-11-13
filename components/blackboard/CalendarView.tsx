import React, { useState } from 'react';
import { CalendarEvent } from '../../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onClose: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + offset);
        return newDate;
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <h2 className="text-2xl font-bold text-[#0d624e] text-center">
        {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
      </h2>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 gap-1 text-center font-semibold text-black/70 mb-2">
      {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
    </div>
  );

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-start-${i}`} className="border border-transparent"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isToday = cellDate.toDateString() === today.toDateString();
      const dayEvents = events.filter(e => new Date(e.date).toDateString() === cellDate.toDateString());

      cells.push(
        <div key={day} className="p-1 border border-black/10 rounded-md bg-white/40 min-h-[110px] flex flex-col hover:bg-white/70 transition-colors">
          <div className="flex justify-start">
            <span className={`font-bold text-sm ${isToday ? 'bg-[#ff5500] text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-black/80'}`}>{day}</span>
          </div>
          <div className="mt-1 space-y-1 overflow-hidden text-left text-xs flex-1">
            {dayEvents.map(event => (
              <div key={event.id} className="bg-[#0d624e]/90 text-white p-1 rounded-md truncate" title={event.title}>
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 gap-1">{cells}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#e6e2df] rounded-lg shadow-xl p-4 md:p-6 w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-black/50 hover:text-black z-10 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarView;