import React from 'react';
import { ResultState } from '../../../types';
import { SparklesIcon, SpinnerIcon, ErrorIcon } from './icons';

interface ResultPanelProps {
  resultState: ResultState;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ resultState }) => {
  const renderContent = () => {
    switch (resultState.status) {
      case 'welcome':
        return (
          <div className="text-center text-gray-500 animate-fade-in-up">
            <SparklesIcon className="w-20 h-20 mx-auto text-[#f29100]" />
            <h3 className="mt-4 text-xl font-bold text-black">Bienvenido a Mobi Design</h3>
            <p className="mt-2">Completa los 3 pasos para que nuestra IA cree tu espacio soñado.</p>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center text-gray-600 animate-fade-in-up">
              <SpinnerIcon className="w-16 h-16 mx-auto fill-[#ff5500] text-black/10" />
              <p className="mt-4 font-semibold text-lg">Creando magia...</p>
              <p className="text-sm">{resultState.message}</p>
          </div>
        );
      case 'success':
        return (
          <div className="w-full h-full animate-zoom-in">
            <img 
              src={`data:image/png;base64,${resultState.data}`} 
              alt="Diseño generado" 
              className="w-full h-full object-contain rounded-lg" 
            />
          </div>
        );
      case 'error':
        return (
            <div className="text-center text-red-600 animate-fade-in-up bg-red-500/10 p-4 rounded-lg">
                <ErrorIcon className="w-16 h-16 mx-auto" />
                <h3 className="mt-4 text-xl font-bold text-red-700">¡Ups! Algo salió mal</h3>
                <p className="mt-2 text-sm text-red-600">{resultState.message}</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

export default ResultPanel;
