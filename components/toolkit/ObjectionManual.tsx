import React, { useState } from 'react';
import { MobiState, Objection } from '../../types';
import Modal from '../common/Modal';

interface ObjectionManualProps {
  mobiState: MobiState;
}

const ObjectionManual: React.FC<ObjectionManualProps> = ({ mobiState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingObjection, setEditingObjection] = useState<Objection | null>(null);
  const [objectionToDelete, setObjectionToDelete] = useState<Objection | null>(null);
  const [newObjectionTitle, setNewObjectionTitle] = useState('');
  const [newObjectionArgs, setNewObjectionArgs] = useState('');

  const handleEdit = (objection: Objection) => {
    setEditingObjection(objection);
    setNewObjectionTitle(objection.title);
    setNewObjectionArgs(objection.arguments.join('\n'));
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingObjection(null);
    setNewObjectionTitle('');
    setNewObjectionArgs('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newObjectionTitle.trim() || !newObjectionArgs.trim()) return;

    const argsArray = newObjectionArgs.split('\n').filter(arg => arg.trim() !== '');

    if (editingObjection) {
      mobiState.updateObjection({
        ...editingObjection,
        title: newObjectionTitle,
        arguments: argsArray,
      });
    } else {
      mobiState.addObjection({
        title: newObjectionTitle,
        arguments: argsArray,
      });
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = (objection: Objection) => {
    setObjectionToDelete(objection);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (objectionToDelete) {
      mobiState.deleteObjection(objectionToDelete.id);
      setIsDeleteModalOpen(false);
      setObjectionToDelete(null);
    }
  };

  return (
    <div className="bg-white/50 p-6 rounded-lg shadow-md border border-black/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#0d624e]">Manual de Objeciones</h2>
        <button
          onClick={handleAddNew}
          className="bg-[#0d624e] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
        >
          + Añadir Objeción
        </button>
      </div>

      <div className="space-y-4">
        {mobiState.objections.map((objection) => (
          <div key={objection.id} className="bg-white/70 p-4 rounded-lg border border-black/10">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-black mb-2">{objection.title}</h3>
                <div className="flex items-center space-x-4">
                    <button onClick={() => handleEdit(objection)} className="text-sm text-[#ff5500] hover:underline">Editar</button>
                    <button onClick={() => handleDelete(objection)} className="text-sm text-red-600 hover:underline">Borrar</button>
                </div>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              {objection.arguments.map((arg, index) => (
                <li key={index} className="text-black/80">{arg}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingObjection ? 'Editar Objeción' : 'Nueva Objeción'}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-black/80 mb-1">Título de la Objeción</label>
                <input 
                    type="text"
                    value={newObjectionTitle}
                    onChange={(e) => setNewObjectionTitle(e.target.value)}
                    className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500]"
                    placeholder="Ej: Precio elevado"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-black/80 mb-1">Contra-argumentos (uno por línea)</label>
                <textarea
                    value={newObjectionArgs}
                    onChange={(e) => setNewObjectionArgs(e.target.value)}
                    rows={5}
                    className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500]"
                    placeholder="Ej: Hablemos del valor a largo plazo..."
                ></textarea>
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-[#0d624e] text-white hover:bg-opacity-90">Guardar</button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
        <p className="text-black/80 mb-6">
          ¿Estás seguro de que quieres borrar la objeción "<strong>{objectionToDelete?.title}</strong>"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Confirmar Borrado</button>
        </div>
      </Modal>
    </div>
  );
};

export default ObjectionManual;