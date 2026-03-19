
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.includes('PLACEHOLDER');
const ai = hasValidKey ? new GoogleGenAI({ apiKey: apiKey! }) : null;

export const analyzeDeal = async (productTitle: string, price: number, retailPrice: number) => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Analise este negócio do marketplace XTUDO PARAGUAI: 
      Produto: ${productTitle}
      Preço XTUDO: R$ ${price}
      Preço Varejo BR: R$ ${retailPrice}
      
      Diga se vale a pena, qual a economia em porcentagem e dê um conselho de "especialista em compras inteligentes".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            economyPercentage: { type: Type.NUMBER },
            worthIt: { type: Type.BOOLEAN },
            expertAdvice: { type: Type.STRING },
            status: { type: Type.STRING, description: 'One word: EXCELENTE, BOM, ou REGULAR' }
          },
          required: ["economyPercentage", "worthIt", "expertAdvice", "status"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getSmartSearchSuggestions = async (query: string) => {
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `O usuário está buscando: "${query}" em um marketplace de importados do Paraguai. Sugira 3 termos de busca relacionados que costumam ter ótimos preços em Ciudad del Este.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
}

export const getProductOptimizationSuggestion = async (productTitle: string, currentPrice: number, stock: number) => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Como consultor de e-commerce especializado no mercado Brasil-Paraguai, analise este produto do vendedor:
      Produto: ${productTitle}
      Preço Atual: R$ ${currentPrice}
      Estoque: ${stock} unidades
      
      Identifique o potencial de vendas (Escala 1-100) e sugira uma ação estratégica (Ex: promoção relâmpago, otimização de palavras-chave, ou kit/bundle).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            potentialScore: { type: Type.NUMBER },
            strategyTitle: { type: Type.STRING },
            actionPlan: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            estimatedLift: { type: Type.STRING, description: "Expectativa de aumento em %" }
          },
          required: ["potentialScore", "strategyTitle", "actionPlan", "reasoning", "estimatedLift"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Optimization Error:", error);
    return null;
  }
};
