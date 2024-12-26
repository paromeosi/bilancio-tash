import React, { useState, useEffect } from 'react';

const TransactionForm = ({ isOpen, onClose, type, transaction, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    notes: '',
    newCategory: ''
  });

  // Carica i dati della transazione quando si modifica
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: transaction.amount,
        category: transaction.category,
        notes: transaction.notes || '',
        newCategory: ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        notes: '',
        newCategory: ''
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category === 'nuova' ? formData.newCategory : formData.category,
      notes: formData.notes,
      type
    };

    try {
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio della transazione');
    }
  };

  if (!isOpen) return null;

  const predefinedCategories = type === 'income' 
    ? ['Stipendio', 'Bonus', 'Rimborsi', 'Altro'] 
    : ['Spesa', 'Affitto', 'Bollette', 'Trasporti', 'Svago', 'Altro'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {transaction ? 'Modifica Transazione' : type === 'income' ? 'Nuova Entrata' : 'Nuova Uscita'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleziona categoria</option>
                {predefinedCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="nuova">+ Aggiungi nuova categoria</option>
              </select>
            </div>

            {formData.category === 'nuova' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nuova Categoria
                </label>
                <input
                  type="text"
                  value={formData.newCategory}
                  onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome categoria"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Aggiungi note (opzionale)"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Annulla
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 ${
                  type === 'income'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {transaction ? 'Salva modifiche' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;