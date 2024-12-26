import React, { useState } from 'react';
import useTransactions from '../../hooks/useTransactions';
import TransactionForm from './Transactions/TransactionForm';
import FilterSection from './Filters/FilterSection';
import ChartSection from './Charts/ChartSection';
import CategorySummary from './Reports/CategorySummary';
import { exportToCSV } from '../../utils/exportUtils';

// Componente ExportButton
const ExportButton = ({ onExport, filters }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Esporta CSV
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onExport();
                setShowOptions(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Esporta tutto
            </button>
            <button
              onClick={() => {
                onExport(filters);
                setShowOptions(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Esporta periodo filtrato
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCategorySummary, setShowCategorySummary] = useState(false);
  const [filters, setFilters] = useState({
    period: 'all',
    startDate: null,
    endDate: null
  });

  const { 
    transactions, 
    loading, 
    error, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    calculateTotals 
  } = useTransactions();

  const handleAddTransaction = (type) => {
    setTransactionType(type);
    setEditingTransaction(null);
    setShowTransactionModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionType(transaction.type);
    setShowTransactionModal(true);
  };

  const filterTransactions = (transactions) => {
    if (!filters.startDate && !filters.endDate) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;
      
      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }
      
      return true;
    });
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('Errore durante l\'eliminazione della transazione');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('it-IT');
  };

  const filteredTransactions = filterTransactions(transactions);
  const { totalIncome, totalExpense, balance } = calculateTotals(filteredTransactions);

  return (
    <div className="p-6">
      {/* Sezione Filtri e Export */}
      <div className="flex justify-between items-start mb-6">
        <FilterSection 
          filters={filters}
          onFilterChange={setFilters}
        />
        <ExportButton 
          onExport={(dateRange) => exportToCSV(transactions, dateRange)} 
          filters={filters}
        />
      </div>

      {/* Card dei totali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-800">Entrate Totali</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-red-800">Uscite Totali</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-800">Saldo</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Sezione Grafici */}
      <ChartSection transactions={filteredTransactions} />

      {/* Toggle Report Categorie */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowCategorySummary(!showCategorySummary)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {showCategorySummary ? 'Nascondi' : 'Mostra'} Report Categorie
        </button>
      </div>

      {/* Report Categorie */}
      {showCategorySummary && (
        <div className="mb-6">
          <CategorySummary transactions={filteredTransactions} />
        </div>
      )}

      {/* Bottoni per aggiungere transazioni */}
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={() => handleAddTransaction('income')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Entrata
        </button>
        <button
          onClick={() => handleAddTransaction('expense')}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
          Uscita
        </button>
      </div>

      {/* Lista delle transazioni */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transazioni</h3>
        </div>
        
        {loading && (
          <div className="text-center py-4">Caricamento...</div>
        )}

        {error && !loading && transactions.length === 0 && (
          <div className="text-center py-4 text-gray-600">
            Non ci sono ancora transazioni
          </div>
        )}

        {!loading && (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{transaction.category}</span>
                      <span className="ml-2 text-sm text-gray-500">{formatDate(transaction.date)}</span>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modale per aggiungere/modificare transazioni */}
      <TransactionForm
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        type={transactionType}
        transaction={editingTransaction}
        onSubmit={async (data) => {
          try {
            if (editingTransaction) {
              await updateTransaction(editingTransaction.id, data);
            } else {
              await addTransaction(data);
            }
            setShowTransactionModal(false);
            setEditingTransaction(null);
          } catch (error) {
            alert('Errore durante il salvataggio della transazione');
          }
        }}
      />
    </div>
  );
};

export default Dashboard;