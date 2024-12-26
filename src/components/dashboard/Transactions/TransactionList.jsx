import React, { useState } from 'react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('date')}
            >
              Data
              {sortConfig.key === 'date' && (
                <span className="ml-1">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              Importo
              {sortConfig.key === 'amount' && (
                <span className="ml-1">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('category')}
            >
              Categoria
              {sortConfig.key === 'category' && (
                <span className="ml-1">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Azioni
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTransactions.map((transaction) => (
            <tr 
              key={transaction.id}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(transaction.date)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatAmount(transaction.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.category}
              </td>
              <td className="px-6 py-4">
                <div className="truncate max-w-xs">
                  {transaction.notes}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;