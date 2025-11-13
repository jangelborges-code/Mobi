
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from '@google/genai';
import { Lead, Message, Temperature, ImageFile, MobiChatMessage, Objection } from '../types';

const VITE_API_KEY = process.env.VITE_API_KEY;

if (!VITE_API_KEY) {
  throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: VITE_API_KEY });

const getConversationText = (conversation: Message[]): string => {
  return conversation
    .map(msg => `${msg.sender === 'agent' ? 'Agente' : 'Lead'}: ${msg.text}`)
    .join('\n');
};

export const generateLeadResponse = async (lead: Lead, agentMessage: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const conversationHistory = getConversationText(lead.conversation);
  const prompt = `
    Eres el lead de esta conversación. Tu perfil es: "${lead.persona}".
    La conversación hasta ahora es:
    ${conversationHistory}
    ---
    El agente inmobiliario acaba de decir: "${agentMessage}"
    ---
    Responde de forma natural y coherente con tu perfil y la conversación. Tu respuesta debe ser breve (1-3 frases) y debe hacer avanzar la conversación o plantear una pregunta relevante.
    NO uses markdown. Solo texto plano.
    `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating lead response:", error);
    return "Lo siento, ahora mismo no puedo pensar en una respuesta. ¿Podemos hablar más tarde?";
  }
};


export const analyzeSentiment = async (message: string): Promise<Temperature> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Analiza el sentimiento de este mensaje de un potencial comprador de vivienda: "${message}".
    Responde únicamente con una de estas tres palabras, sin puntuación ni texto adicional: Caliente, Tibio, Frío.
    - 'Caliente' si muestra claro interés, entusiasmo o intención de compra.
    - 'Frío' si muestra desinterés, una objeción fuerte o es negativo.
    - 'Tibio' si es neutral, hace preguntas informativas o no está claro.
    `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    const sentiment = response.text.trim();
    if (sentiment === 'Caliente') return Temperature.Hot;
    if (sentiment === 'Frío') return Temperature.Cold;
    return Temperature.Warm;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return Temperature.Warm;
  }
};

export const getMobiSuggestions = async (lead: Lead, count: number = 3): Promise<string[]> => {
    const model = 'gemini-2.5-pro';
    const conversationHistory = getConversationText(lead.conversation);
    const prompt = `
    Eres Mobi, un co-piloto de IA para agentes inmobiliarios. Tu objetivo es guiar al agente a través del embudo de ventas: Conectar -> Entender -> Visualizar -> Resolver -> Cerrar.
    
    Analiza la siguiente conversación con un lead:
    Perfil del Lead: "${lead.persona}"
    Historial de Conversación:
    ${conversationHistory}
    
    Basado en el estado actual de la conversación, sugiere ${count} acciones cortas y concretas para el agente.
    Si el lead ha mencionado una objeción, una de las sugerencias debe ser "Consultar Manual de Objeciones".
    Si el lead duda sobre el espacio, una sugerencia debe ser "Usar 'Visualizador de Sueños'".
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sugerencias: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.sugerencias || [];
    } catch (error) {
        console.error("Error getting Mobi suggestions:", error);
        return ["Enviar brochure del proyecto", "Preguntar por su presupuesto", "Invitar a un café"];
    }
};

export const generateObjectionResponse = async (lead: Lead, objection: Objection): Promise<string> => {
  const model = 'gemini-2.5-pro';
  const conversationHistory = getConversationText(lead.conversation);
  
  const systemInstruction = `Eres Mobi, un coach de ventas inmobiliarias experto. Tu tono es directo, útil y estratégico. Proporciona guiones listos para usar.`;

  const prompt = `
    Un agente está hablando con un lead y se ha encontrado con una objeción. Tu tarea es generar la respuesta perfecta y personalizada.

    ## Contexto del Lead
    - **Perfil:** ${lead.persona}
    - **Conversación hasta ahora:**
      ${conversationHistory}

    ## Objeción Presentada
    - **Título:** ${objection.title}
    - **Argumentos genéricos disponibles:** ${objection.arguments.join('; ')}

    ## Tu Misión
    Genera un guion corto y directo que el agente pueda usar ahora mismo para responder a esta objeción. La respuesta debe ser altamente personalizada para el perfil del lead y el contexto de la conversación. No te limites a repetir los argumentos genéricos; adáptalos o crea uno nuevo que sea más efectivo para este cliente en particular.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating objection response:", error);
    return "No se pudo generar una respuesta. Intenta reformulando la objeción o revisa los argumentos base.";
  }
};

export const getMobiChatbotResponse = async (
  history: MobiChatMessage[],
  newMessage: string,
  lead: Lead
): Promise<string> => {
  const model = 'gemini-2.5-pro';
  const chatHistoryText = history
    .map(msg => `${msg.sender === 'agent' ? 'Agente' : 'Mobi'}: ${msg.text}`)
    .join('\n');

  const systemInstruction = `Eres Mobi, un co-piloto de IA y coach experto en ventas inmobiliarias. Tu tono es amigable, profesional y de gran ayuda. Tu objetivo es proporcionar estrategias y guiones accionables para ayudar a un agente a cerrar una venta. NO respondas como el lead. Responde siempre como el coach Mobi.`;

  const prompt = `
    Estás asesorando a un agente sobre cómo interactuar con un lead específico.
    
    ## Contexto del Lead:
    - **Nombre:** ${lead.name}
    - **Perfil:** ${lead.persona}
    - **Historial de conversación con el agente:**
      ${getConversationText(lead.conversation)}

    ## Tu conversación de coaching con el agente hasta ahora:
    ${chatHistoryText}

    ## Nueva pregunta del agente:
    "${newMessage}"

    ## Tu Tarea:
    Basado en TODO el contexto anterior, proporciona una respuesta detallada y útil. Ofrece consejos, posibles guiones de conversación, y explica el razonamiento detrás de tus sugerencias. Mantén tus respuestas enfocadas y prácticas.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error getting Mobi chatbot response:", error);
    return "Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo.";
  }
};

export const generateDreamImage = async (prompt: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';
    try {
        const fullPrompt = `Foto realista y de alta calidad de un interior de departamento moderno. ${prompt}. Estilo de revista de arquitectura, iluminación natural brillante.`;
        const response = await ai.models.generateImages({
            model: model,
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating dream image:", error);
        throw error;
    }
};


// Mobi Design Services

export const enhancePrompt = async (userInstruction: string): Promise<string> => {
    const replacementKeywords = ["reemplaza", "cambia", "en lugar de", "sustituye"];
    const isReplacement = replacementKeywords.some(keyword => userInstruction.toLowerCase().includes(keyword));

    const mode = isReplacement ? "Reemplazo Preciso" : "Diseñador Creativo";
    
    const systemInstruction = `Eres un asistente de diseño de interiores experto. Tu tarea es reescribir la instrucción del usuario en un prompt detallado y profesional para un modelo de IA de edición de imágenes.
    
    Modo Actual: ${mode}.
    
    - Si el modo es "Diseñador Creativo", mejora la instrucción para sugerir la mejor ubicación posible, considerando escala, proporciones, iluminación realista y flujo del espacio. Sé descriptivo y artístico.
    - Si el modo es "Reemplazo Preciso", genera un prompt técnico y literal en dos pasos: 1) Inpainting para eliminar el objeto antiguo, y 2) Colocación exacta del nuevo objeto.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Instrucción del usuario: "${userInstruction}"`,
            config: { systemInstruction },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        throw new Error("No se pudo procesar la instrucción.");
    }
};

export const editImage = async (roomImage: ImageFile, enhancedPrompt: string): Promise<string> => {
    const systemInstruction = `Eres un editor de fotos experto en diseño de interiores. Sigue estas reglas críticas:
1.  **Integración Realista:** Sigue las reglas de perspectiva, escala, iluminación y sombras de la foto original para un resultado fotorrealista.
2.  **Inpainting Limpio:** Si se pide reemplazar un objeto, elimínalo por completo sin dejar rastro antes de insertar el nuevo.
3.  **No Alteración:** El resto de la imagen del cliente debe permanecer intacta. No añadas, elimines ni modifiques ningún otro elemento de la habitación.`;

    const imageParts = [
        { inlineData: { data: roomImage.base64, mimeType: roomImage.mimeType } },
        { text: enhancedPrompt }
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: imageParts },
            config: {
                systemInstruction,
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("La respuesta de la IA no contenía una imagen.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("No se pudo generar el diseño final.");
    }
};