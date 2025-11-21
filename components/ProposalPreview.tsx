import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { ProposalInput, ProposalOutput } from '../types';

interface ProposalPreviewProps {
  inputData: ProposalInput;
  generatedData: ProposalOutput;
  onBack: () => void;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ inputData, generatedData, onBack }) => {
  
  const totalValue = inputData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar - Hidden when printing */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} /> Voltar e Editar
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
          >
            <Printer size={20} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* Proposal Document - A4 feel */}
      <div className="bg-white shadow-2xl print:shadow-none mx-auto w-full max-w-[210mm] min-h-[297mm] p-[20mm] md:p-[25mm] print:p-0 text-gray-800 leading-relaxed">
        
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">{inputData.sender.name}</h1>
            <div className="text-sm text-gray-500 mt-2 space-y-0.5">
              <p>{inputData.sender.email}</p>
              <p>{inputData.sender.phone}</p>
              {inputData.sender.address && <p>{inputData.sender.address}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-700">Proposta Comercial</h2>
            <p className="text-sm text-gray-500 mt-1">Data: {currentDate}</p>
            <p className="text-sm text-gray-500">Validade: {inputData.validityDays} dias</p>
          </div>
        </header>

        {/* Client Info */}
        <section className="mb-10 bg-gray-50 p-6 rounded-lg print:bg-transparent print:p-0 print:border print:border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Preparado para</h3>
          <div className="text-lg font-medium text-gray-900">{inputData.client.name}</div>
          <div className="text-gray-600">A/C: {inputData.client.contactName}</div>
          <div className="text-gray-600 mt-2 font-semibold">{inputData.client.projectTitle}</div>
        </section>

        {/* AI Generated Content */}
        <div className="space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3 mb-4">
              1. Introdução
            </h2>
            <p className="text-justify text-gray-700 whitespace-pre-line">{generatedData.introduction}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3 mb-4">
              2. Objetivo e Escopo
            </h2>
            <p className="mb-4 text-gray-700">{generatedData.objective}</p>
            
            <h4 className="font-semibold text-gray-800 mt-4 mb-2">Como vamos trabalhar:</h4>
            <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
              {generatedData.methodology.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="page-break"></div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3 mb-4">
              3. Cronograma Estimado
            </h2>
            <p className="text-gray-700 bg-blue-50 p-4 rounded border-l-4 border-blue-300 print:bg-transparent print:border-gray-200 print:border">
              {generatedData.timeline}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3 mb-4">
              4. Investimento
            </h2>
            <p className="mb-6 text-gray-700 italic">{generatedData.investmentText}</p>

            <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 print:bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item / Serviço</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unitário</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inputData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 print:bg-gray-50 font-bold">
                    <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-900 uppercase">Total do Investimento</td>
                    <td className="px-6 py-4 text-right text-lg text-blue-700">{formattedTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3 mb-4">
              5. Termos e Condições
            </h2>
            <ul className="list-decimal list-outside ml-5 space-y-2 text-sm text-gray-600">
              {generatedData.termsAndConditions.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t-2 border-gray-200 pt-8">
            <p className="text-center text-lg font-medium text-gray-800 mb-8">{generatedData.closing}</p>
            
            <div className="flex justify-between items-end mt-20 print:mt-24 gap-10">
              <div className="flex-1 text-center">
                <div className="border-t border-black w-full mb-2"></div>
                <p className="font-bold text-gray-900">{inputData.sender.contactName}</p>
                <p className="text-sm text-gray-500">{inputData.sender.name}</p>
              </div>
              <div className="flex-1 text-center">
                <div className="border-t border-black w-full mb-2"></div>
                <p className="font-bold text-gray-900">{inputData.client.contactName}</p>
                <p className="text-sm text-gray-500">{inputData.client.name}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>Proposta gerada automaticamente por {inputData.sender.name}.</p>
        </footer>

      </div>
    </div>
  );
};

export default ProposalPreview;