import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategorySummary = ({ transactions }) => {
  // Calcola i totali per categoria
  const calculateCategorySummary = () => {
    const summary = transactions.reduce((acc, transaction) => {
      const type = transaction.type === 'income' ? 'entrate' : 'uscite';
      if (!acc[type][transaction.category]) {
        acc[type][transaction.category] = 0;
      }
      acc[type][transaction.category] += Number(transaction.amount);
      acc[type].totale += Number(transaction.amount);
      return acc;
    }, { 
      entrate: { totale: 0 }, 
      uscite: { totale: 0 } 
    });

    // Calcola le percentuali e prepara i dati per la visualizzazione
    const processedData = {
      entrate: Object.entries(summary.entrate)
        .filter(([key]) => key !== 'totale')
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: ((amount / summary.entrate.totale) * 100).toFixed(1)
        }))
        .sort((a, b) => b.amount - a.amount),
      uscite: Object.entries(summary.uscite)
        .filter(([key]) => key !== 'totale')
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: ((amount / summary.uscite.totale) * 100).toFixed(1)
        }))
        .sort((a, b) => b.amount - a.amount)
    };

    return { summary, processedData };
  };

  const { summary, processedData } = calculateCategorySummary();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Riepilogo Entrate */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Riepilogo Entrate</h3>
        <div className="h-[300px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.entrate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={value => `${value}%`} />
              <Tooltip 
                formatter={(value, name) => [
                  `${formatCurrency(value)}\n${processedData.entrate.find(d => d.amount === value)?.percentage}%`,
                  'Importo'
                ]}
              />
              <Bar dataKey="amount" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Dettaglio Categorie:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedData.entrate.map(({ category, amount, percentage }) => (
              <div key={category} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="font-medium">{category}</span>
                <div className="text-right">
                  <div className="text-green-600">{formatCurrency(amount)}</div>
                  <div className="text-sm text-gray-500">{percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Riepilogo Uscite */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Riepilogo Uscite</h3>
        <div className="h-[300px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData.uscite}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={value => `${value}%`} />
              <Tooltip 
                formatter={(value, name) => [
                  `${formatCurrency(value)}\n${processedData.uscite.find(d => d.amount === value)?.percentage}%`,
                  'Importo'
                ]}
              />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Dettaglio Categorie:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedData.uscite.map(({ category, amount, percentage }) => (
              <div key={category} className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="font-medium">{category}</span>
                <div className="text-right">
                  <div className="text-red-600">{formatCurrency(amount)}</div>
                  <div className="text-sm text-gray-500">{percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;