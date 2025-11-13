import React, { useState, useEffect } from 'react';
import { FurnitureItem } from '../../../types';
import { SofaIcon, ChairIcon, TableIcon, DecorIcon } from './icons';
import Modal from '../../common/Modal';

// Placeholder for an actual product image.
const PlaceholderImage: React.FC<{ name: string; isSelected?: boolean }> = ({ name, isSelected }) => (
    <div className={`w-full h-full bg-gray-200 flex items-center justify-center text-center p-2 rounded-md border-2 transition-all ${isSelected ? 'border-[#ff5500]' : 'border-transparent'}`}>
        <span className="text-xs text-gray-500">{name}</span>
    </div>
);

interface ProductOption extends FurnitureItem {}

interface ProductFamily {
  id: string;
  name: string;
  icon: React.ReactNode;
  options: ProductOption[];
}

const CATALOG_DATA: ProductFamily[] = [
  {
    id: 'sofas', name: 'Sofás', icon: <SofaIcon className="w-10 h-10 text-gray-600" />,
    options: Array.from({ length: 10 }, (_, i) => ({ id: `sofa-${i+1}`, name: `Sofá ${i+1}`, prompt: `a modern sofa model S-${i+1}` }))
  },
  {
    id: 'chairs', name: 'Sillones', icon: <ChairIcon className="w-10 h-10 text-gray-600" />,
    options: Array.from({ length: 10 }, (_, i) => ({ id: `chair-${i+1}`, name: `Sillón ${i+1}`, prompt: `a stylish armchair model C-${i+1}` }))
  },
  {
    id: 'tables', name: 'Mesas', icon: <TableIcon className="w-10 h-10 text-gray-600" />,
    options: Array.from({ length: 10 }, (_, i) => ({ id: `table-${i+1}`, name: `Mesa ${i+1}`, prompt: `a minimalist coffee table model T-${i+1}` }))
  },
  {
    id: 'decor', name: 'Decoración', icon: <DecorIcon className="w-10 h-10 text-gray-600" />,
    options: Array.from({ length: 10 }, (_, i) => ({ id: `decor-${i+1}`, name: `Decoración ${i+1}`, prompt: `a decorative element, like a vase or lamp, model D-${i+1}` }))
  }
];

interface FurnitureCatalogProps {
  onSelectionChange: (selectedItems: FurnitureItem[]) => void;
}

const FurnitureCatalog: React.FC<FurnitureCatalogProps> = ({ onSelectionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, FurnitureItem | null>>({
    sofas: null, chairs: null, tables: null, decor: null,
  });
  const [modalFamily, setModalFamily] = useState<ProductFamily | null>(null);

  useEffect(() => {
    const selectedItems = Object.values(selectedOptions).filter((item): item is FurnitureItem => item !== null);
    onSelectionChange(selectedItems);
  }, [selectedOptions, onSelectionChange]);

  const handleSelectOption = (familyId: string, option: FurnitureItem) => {
    setSelectedOptions(prev => ({ ...prev, [familyId]: option }));
    setModalFamily(null);
  };
  
  const handleClearOption = (e: React.MouseEvent, familyId: string) => {
      e.stopPropagation();
      setSelectedOptions(prev => ({...prev, [familyId]: null}));
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATALOG_DATA.map(family => {
          const selected = selectedOptions[family.id];
          return (
            <div
              key={family.id}
              onClick={() => setModalFamily(family)}
              className="relative aspect-square rounded-lg overflow-hidden border-2 bg-white/50 hover:border-[#ff5500] transition-all duration-200 cursor-pointer group flex flex-col items-center justify-center p-2 text-center"
            >
              {selected ? (
                <>
                    <PlaceholderImage name={selected.name} />
                    <button 
                        onClick={(e) => handleClearOption(e, family.id)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Quitar ${selected.name}`}
                    >
                        &times;
                    </button>
                </>
              ) : (
                <>
                  {family.icon}
                  <p className="mt-2 text-sm font-semibold text-gray-700">{family.name}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {modalFamily && (
        <Modal isOpen={!!modalFamily} onClose={() => setModalFamily(null)} title={`Seleccionar ${modalFamily.name}`}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {modalFamily.options.map(option => (
              <div
                key={option.id}
                onClick={() => handleSelectOption(modalFamily.id, option)}
                className="aspect-square cursor-pointer hover:scale-105 transition-transform"
              >
                <PlaceholderImage name={option.name} isSelected={selectedOptions[modalFamily.id]?.id === option.id} />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default FurnitureCatalog;
