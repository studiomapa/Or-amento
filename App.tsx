import React, { useState } from 'react';
import ProposalForm from './components/ProposalForm';
import ProposalPreview from './components/ProposalPreview';
import { ProposalInput, ProposalOutput } from './types';
import { generateProposalContent } from './services/geminiService';
import { Briefcase } from 'lucide-react';

const initialData: ProposalInput = {
  sender: {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: ''
  },
  client: {
    name: '',
    contactName: '',
    projectTitle: ''
  },
  projectDescription: '',
  items: [],
  validityDays: 15,
  tone: 'formal'
};

function App() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [data, setData] = useState<ProposalInput>(initialData);
  const [generatedProposal, setGeneratedProposal] = useState<ProposalOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      setError("Erro de configuração: API Key não encontrada.");
      return;
    }

    if (data.items.length === 0) {
        if (!confirm("Você não adicionou itens de preço. Deseja continuar mesmo assim?")) {
            return;
        }
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateProposalContent(data);
      setGeneratedProposal(result);
      setStep('preview');
    } catch (err: any) {
      setError("Ocorreu um erro ao gerar a proposta. Verifique sua conexão e tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* App Header - Hidden on Print */}
      <header className="bg-white border-b border-gray-200 py-4 no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Proposta<span className="text-indigo-600">AI</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {step === 'form' ? 'Passo 1: Preenchimento' : 'Passo 2: Visualização e Impressão'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 no-print rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'form' ? (
          <ProposalForm 
            data={data} 
            setData={setData} 
            onSubmit={handleGenerate} 
            isLoading={loading} 
          />
        ) : (
          generatedProposal && (
            <ProposalPreview 
              inputData={data} 
              generatedData={generatedProposal} 
              onBack={() => setStep('form')} 
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;