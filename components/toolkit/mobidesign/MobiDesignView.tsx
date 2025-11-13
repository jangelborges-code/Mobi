import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import FurnitureCatalog from './FurnitureCatalog';
import ResultPanel from './ResultPanel';
import { ImageFile, FurnitureItem, ResultState } from '../../../types';
import { enhancePrompt, editImage } from '../../../services/geminiService';

const MobiDesignView: React.FC = () => {
    const [roomImage, setRoomImage] = useState<ImageFile | null>(null);
    const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem[]>([]);
    const [userInstruction, setUserInstruction] = useState<string>('');
    const [resultState, setResultState] = useState<ResultState>({ status: 'welcome' });
    const [error, setError] = useState<string | null>(null);

    const handleGenerateDesign = async () => {
        if (!roomImage || selectedFurniture.length === 0 || !userInstruction.trim()) {
            setError("Por favor, completa todos los pasos antes de generar.");
            return;
        }
        setError(null);

        try {
            setResultState({ status: 'loading', message: 'Analizando tu petición...' });

            const furniturePrompts = selectedFurniture.map(f => f.prompt).join('. ');
            const fullInstruction = `${userInstruction}. Incluye los siguientes elementos en la escena de forma realista: ${furniturePrompts}`;
            
            const enhancedUserPrompt = await enhancePrompt(fullInstruction);
            
            setResultState({ status: 'loading', message: 'Creando tu diseño...' });

            const finalImageBase64 = await editImage(roomImage, enhancedUserPrompt);
            
            setResultState({ status: 'success', data: finalImageBase64 });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
            setResultState({ status: 'error', message: errorMessage });
        }
    };
    
    const isButtonDisabled = !roomImage || selectedFurniture.length === 0 || !userInstruction.trim() || resultState.status === 'loading';

    return (
        <div className="w-full h-full">
            {error && (
                <div className="bg-red-500/20 border border-red-600 text-red-800 p-3 rounded-lg mb-4 text-center animate-fade-in-up">
                    {error}
                </div>
            )}

            <main className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Columna Izquierda: Controles */}
                <div className="flex flex-col gap-6">
                    <section>
                        <StepHeader step="1" title="Sube tu Espacio" />
                        <div className="h-64">
                            <ImageUploader image={roomImage} onImageUpload={setRoomImage} onError={(msg) => setError(msg)} />
                        </div>
                    </section>
                    
                    <section>
                        <StepHeader step="2" title="Escoge los Muebles" />
                        <FurnitureCatalog onSelectionChange={setSelectedFurniture} />
                    </section>
                    
                    <section>
                        <StepHeader step="3" title="Describe tu espacio" />
                        <textarea
                            value={userInstruction}
                            onChange={(e) => setUserInstruction(e.target.value)}
                            placeholder="Ej: 'Reemplaza mi sofá por el de terciopelo' o 'Coloca la planta en la esquina derecha'..."
                            className="w-full h-28 p-3 bg-white/50 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5500] transition-shadow"
                            disabled={resultState.status === 'loading'}
                        />
                    </section>
                </div>

                {/* Columna Derecha: Resultado */}
                <div className="bg-white/50 rounded-lg shadow-md border border-black/10 flex flex-col min-h-[400px] lg:min-h-0">
                    <div className="flex-grow flex items-center justify-center">
                       <ResultPanel resultState={resultState} />
                    </div>
                     <div className="p-4 border-t border-black/10">
                        <button
                            onClick={handleGenerateDesign}
                            disabled={isButtonDisabled}
                            className="w-full bg-[#0d624e] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                            {resultState.status === 'loading' ? 'Generando...' : 'Generar Diseño'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StepHeader: React.FC<{ step: string; title: string }> = ({ step, title }) => (
    <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-[#ff5500] flex items-center justify-center text-white font-bold text-lg">{step}</div>
        <h2 className="ml-3 text-2xl font-bold text-black">{title}</h2>
    </div>
);

export default MobiDesignView;