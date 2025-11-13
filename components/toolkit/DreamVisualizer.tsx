
import React, { useState } from 'react';
import { generateDreamImage } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import { MobiState } from '../../types';

interface DreamVisualizerProps {
  mobiState: MobiState;
}

const DreamVisualizer: React.FC<DreamVisualizerProps> = ({mobiState}) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor, introduce una descripción.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const generatedImageUrl = await generateDreamImage(prompt);
      setImageUrl(generatedImageUrl);
      if(mobiState.selectedLead){
          mobiState.addMessageToLead(mobiState.selectedLead.id, {
              sender: 'mobi-image',
              text: `Imagen generada para: "${prompt}"\n${generatedImageUrl}`
          });
      }
    } catch (err) {
      setError('No se pudo generar la imagen. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/50 p-6 rounded-lg shadow-md border border-black/10 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-[#0d624e]">Visualizador de Sueños</h2>
      <p className="text-black/70 mb-4">Ayuda a tus clientes a visualizar su futuro hogar. Describe la escena que quieres crear.</p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: una sala de estar con un gran sofá en L y mucha luz natural..."
          className="flex-1 p-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5500]"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="bg-[#0d624e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generar Imagen'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex-1 bg-black/5 rounded-lg flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        {isLoading && <Spinner large={true} />}
        {!isLoading && imageUrl && (
          <div className="p-4 w-full h-full">
            <img src={imageUrl} alt="Generated dream" className="object-contain w-full h-full rounded-md" />
          </div>
        )}
        {!isLoading && !imageUrl && (
            <div className="text-center text-black/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="mt-2">La imagen generada aparecerá aquí.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DreamVisualizer;
