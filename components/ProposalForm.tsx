import React from 'react';
import { Plus, Trash, FileText, Sparkles } from 'lucide-react';
import { ProposalInput, LineItem } from '../types';

interface ProposalFormProps {
  data: ProposalInput;
  setData: React.Dispatch<React.SetStateAction<ProposalInput>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ data, setData, onSubmit, isLoading }) => {

  const handleChange = (section: keyof ProposalInput, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section] as any, [field]: value }
        : value
    }));
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Nova Proposta Comercial
        </h2>
        <p className="text-blue-100 mt-1">Preencha os dados abaixo para gerar sua proposta com IA.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Section 1: Sender Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Seus Dados (Remetente)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Sua Empresa Ltda"
                value={data.sender.name}
                onChange={(e) => handleChange('sender', 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Seu Nome"
                value={data.sender.contactName}
                onChange={(e) => handleChange('sender', 'contactName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.sender.email}
                onChange={(e) => handleChange('sender', 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.sender.phone}
                onChange={(e) => handleChange('sender', 'phone', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Client Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa/Cliente</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Empresa do Cliente"
                value={data.client.name}
                onChange={(e) => handleChange('client', 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Nome do contato no cliente"
                value={data.client.contactName}
                onChange={(e) => handleChange('client', 'contactName', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Ex: Redesign de Website Corporativo"
                value={data.client.projectTitle}
                onChange={(e) => handleChange('client', 'projectTitle', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Project Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Detalhes do Projeto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Necessidade/Escopo</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[120px]"
                placeholder="Descreva o que o cliente precisa, os problemas atuais e o que será feito. Quanto mais detalhes, melhor a IA irá escrever."
                value={data.projectDescription}
                onChange={(e) => handleChange('projectDescription', '', e.target.value)} // direct assignment handled manually
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validade da Proposta (dias)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={data.validityDays}
                  onChange={(e) => handleChange('validityDays', '', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tom de Voz</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={data.tone}
                  onChange={(e) => handleChange('tone', '', e.target.value)}
                >
                  <option value="formal">Formal e Corporativo</option>
                  <option value="modern">Moderno e Inovador</option>
                  <option value="persuasive">Persuasivo e Vendedor</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Items */}
        <section>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Itens do Orçamento</h3>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition"
            >
              <Plus size={16} /> Adicionar Item
            </button>
          </div>
          
          <div className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex-grow w-full">
                  <input
                    type="text"
                    placeholder="Descrição do serviço/produto"
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-white focus:border-blue-400 outline-none"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="w-full md:w-24">
                  <input
                    type="number"
                    placeholder="Qtd"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-white focus:border-blue-400 outline-none"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                  />
                </div>
                <div className="w-full md:w-32 relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    placeholder="Preço"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded bg-white focus:border-blue-400 outline-none"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
                  />
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-600 p-2"
                  title="Remover item"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
            {data.items.length === 0 && (
              <div className="text-center py-4 text-gray-500 italic">Nenhum item adicionado.</div>
            )}
          </div>
          <div className="mt-4 text-right text-lg font-semibold text-gray-800">
            Total Estimado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
            )}
          </div>
        </section>

        <div className="pt-6">
          <button
            onClick={onSubmit}
            disabled={isLoading || !data.sender.name || !data.client.name}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md flex justify-center items-center gap-2 transition
              ${isLoading || !data.sender.name || !data.client.name 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Gerando Proposta...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Proposta com IA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;