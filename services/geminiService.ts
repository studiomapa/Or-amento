import { GoogleGenAI, Type } from "@google/genai";
import { ProposalInput, ProposalOutput } from "../types";

// Initialize the API client
// Note: process.env.API_KEY is expected to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProposalContent = async (data: ProposalInput): Promise<ProposalOutput> => {
  const modelId = "gemini-2.5-flash";

  // Calculate total value for context
  const totalValue = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);

  const itemListString = data.items.map(item => 
    `- ${item.quantity}x ${item.description} (Valor Unit.: ${item.unitPrice})`
  ).join('\n');

  const prompt = `
    Você é um especialista em vendas e redação comercial.
    Gere o conteúdo de uma proposta comercial profissional com base nos seguintes dados:

    EMPRESA REMETENTE: ${data.sender.name} (Contato: ${data.sender.contactName})
    CLIENTE: ${data.client.name} (Contato: ${data.client.contactName})
    TÍTULO DO PROJETO: ${data.client.projectTitle}
    DESCRIÇÃO DA NECESSIDADE/PROJETO: ${data.projectDescription}
    
    ITENS DO ORÇAMENTO:
    ${itemListString}
    VALOR TOTAL: ${formattedTotal}
    
    VALIDADE DA PROPOSTA: ${data.validityDays} dias
    TOM DE VOZ: ${data.tone === 'formal' ? 'Formal e Corporativo' : data.tone === 'modern' ? 'Moderno e Inovador' : 'Persuasivo e Vendedor'}

    A saída deve ser estritamente um objeto JSON que siga o schema fornecido. O texto deve estar em Português do Brasil, bem formatado e pronto para ser apresentado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Um título atraente para a proposta" },
            introduction: { type: Type.STRING, description: "Texto introdutório cumprimentando o cliente e contextualizando" },
            objective: { type: Type.STRING, description: "Resumo claro do objetivo da proposta e problemas resolvidos" },
            methodology: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Lista de passos ou pontos sobre como o trabalho será entregue" 
            },
            timeline: { type: Type.STRING, description: "Descrição textual da estimativa de tempo de execução" },
            investmentText: { type: Type.STRING, description: "Um texto persuasivo justificando o investimento (não apenas a tabela de preços)" },
            termsAndConditions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de termos essenciais, incluindo validade e condições gerais"
            },
            closing: { type: Type.STRING, description: "Texto de fechamento convidando para assinatura ou próxima reunião" }
          },
          required: ["title", "introduction", "objective", "methodology", "timeline", "investmentText", "termsAndConditions", "closing"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ProposalOutput;
    } else {
      throw new Error("A resposta da IA veio vazia.");
    }
  } catch (error) {
    console.error("Erro ao gerar proposta:", error);
    throw error;
  }
};