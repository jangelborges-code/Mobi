
import React from 'react';

const Spinner: React.FC<{ large?: boolean }> = ({ large = false }) => {
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${large ? 'w-10 h-10 border-white' : 'w-5 h-5 border-current'}`} role="status">
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Spinner;
