import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartSection = ({ transactions }) => {
  // Prepara i dati per il grafico mensile
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = date.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { mese: monthKey, entrate: 0, uscite: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].entrate += Number(transaction.amount);
    } else {
      acc[monthKey].uscite += Number(transaction.amount);
    }
    
    return acc;
  }, {});

  // Prepara i dati per il grafico a torta delle categorie
  const categoryData = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += Number(transaction.amount);
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Grafico andamento mensile */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Andamento Mensile</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Object.values(monthlyData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mese" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entrate" 
                stroke="#22c55e" 
                name="Entrate"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="uscite" 
                stroke="#ef4444" 
                name="Uscite"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grafico distribuzione categorie */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribuzione per Categoria</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;