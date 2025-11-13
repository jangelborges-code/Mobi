import React, { useState, useRef, useEffect } from 'react';
import Modal from '../common/Modal';
import { Lead, Temperature } from '../../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'conversation'>) => void;
  onAddMultipleLeads: (leads: Omit<Lead, 'id' | 'conversation'>[]) => void;
  leadToEdit?: Lead | null;
  onUpdateLead?: (lead: Lead) => void;
}

const pipelineStages = ['Nuevo', 'Contactado', 'Calificado', 'Propuesta', 'Negociación'];
const initialFormState = {
    name: '',
    project: '',
    temperature: Temperature.Warm,
    persona: '',
    phone: '',
    email: '',
    stage: 'Nuevo',
    owner: 'Agente Principal',
    tags: '',
};

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddLead, onAddMultipleLeads, leadToEdit, onUpdateLead }) => {
  const [formData, setFormData] = useState(initialFormState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!leadToEdit;

  useEffect(() => {
    if (isEditMode && leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        project: leadToEdit.project || '',
        temperature: leadToEdit.temperature || Temperature.Warm,
        persona: leadToEdit.persona || '',
        phone: leadToEdit.phone || '',
        email: leadToEdit.email || '',
        stage: leadToEdit.stage || 'Nuevo',
        owner: leadToEdit.owner || 'Agente Principal',
        tags: leadToEdit.tags?.join(', ') || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [leadToEdit, isEditMode, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target?.result as string;
          const rows = text.split('\n').slice(1); // slice(1) to skip header row
          const newLeads: Omit<Lead, 'id' | 'conversation'>[] = [];

          for (const row of rows) {
              if (!row.trim()) continue;
              const columns = row.split(',').map(c => c.trim().replace(/"/g, ''));
              
              if (columns.length < 2) continue; // Must have at least name and project

              const [name, project, temperature, persona, phone, email, stage, tags] = columns;

              const validTemperatures = Object.values(Temperature);
              const leadTemp = validTemperatures.includes(temperature as Temperature) ? temperature as Temperature : Temperature.Warm;

              const leadData = {
                  name,
                  project,
                  temperature: leadTemp,
                  persona: persona || '',
                  phone: phone || '',
                  email: email || '',
                  stage: stage || 'Nuevo',
                  owner: 'Agente Principal',
                  tags: tags ? tags.split(';').map(t => t.trim()) : []
              };
              newLeads.push(leadData);
          }

          if (newLeads.length > 0) {
            onAddMultipleLeads(newLeads);
            alert(`${newLeads.length} leads importados correctamente.`);
          } else {
            alert("No se pudieron importar los leads. Revisa el formato del archivo.");
          }

          onClose();
      };
      reader.readAsText(file);
      // Reset file input
      if(event.target) event.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.project.trim()) {
        alert("El nombre y el proyecto son obligatorios.");
        return;
    }

    const finalData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (isEditMode && onUpdateLead && leadToEdit) {
        onUpdateLead({ ...leadToEdit, ...finalData });
    } else {
        onAddLead(finalData);
    }
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Editar Lead' : 'Añadir Nuevo Lead'}>
        {!isEditMode && (
          <>
            <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-4">
                <p className="text-sm text-black/70">Rellena el formulario o importa un archivo.</p>
                <button
                    onClick={handleImportClick}
                    className="bg-white border border-[#0d624e] text-[#0d624e] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black/5 transition-all duration-200"
                >
                    Importar CSV
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept=".csv"
                />
            </div>
            <div className="text-xs text-black/60 bg-black/5 p-2 rounded-md mb-6">
                <strong>Formato CSV:</strong> Las columnas deben ser: `name, project, temperature, persona, phone, email, stage, tags` (separadas por coma). Las etiquetas múltiples dentro de la columna `tags` deben separarse con punto y coma (;).
            </div>
          </>
        )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold border-b border-black/20 pb-2 mb-3 text-black">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Número de Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        {/* Deal Info */}
        <div>
          <h3 className="text-lg font-semibold border-b border-black/20 pb-2 mb-3 text-black">Información del Trato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Proyecto de Interés" name="project" value={formData.project} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-black/80 mb-1">Etapa del Pipeline</label>
              <select name="stage" value={formData.stage} onChange={handleChange} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white">
                {pipelineStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-black/80 mb-1">Temperatura</label>
              <select name="temperature" value={formData.temperature} onChange={handleChange} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white">
                {Object.values(Temperature).map(temp => <option key={temp} value={temp}>{temp}</option>)}
              </select>
            </div>
            <InputField label="Usuario Responsable" name="owner" value={formData.owner} onChange={handleChange} disabled />
          </div>
        </div>
        
        {/* Additional Details */}
        <div>
           <h3 className="text-lg font-semibold border-b border-black/20 pb-2 mb-3 text-black">Detalles Adicionales</h3>
           <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-sm font-medium text-black/80 mb-1">Persona / Notas del Lead</label>
                <textarea name="persona" value={formData.persona} onChange={handleChange} rows={3} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500]" placeholder="Describe el perfil y las necesidades del cliente..."></textarea>
            </div>
            <InputField label="Etiquetas (separadas por coma)" name="tags" value={formData.tags} onChange={handleChange} placeholder="Ej: inversionista, primer_hogar"/>
           </div>
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-[#0d624e] text-white hover:bg-opacity-90">{isEditMode ? 'Guardar Cambios' : 'Añadir Lead'}</button>
        </div>
      </form>
    </Modal>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-black/80 mb-1">{label}{props.required && ' *'}</label>
        <input id={name} name={name} {...props} className="w-full p-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5500] disabled:bg-gray-200" />
    </div>
);


export default AddLeadModal;