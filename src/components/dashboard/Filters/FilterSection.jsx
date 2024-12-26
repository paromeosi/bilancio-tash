import React from 'react';

const FilterSection = ({ filters, onFilterChange }) => {
  const periodi = [
    { value: '1M', label: 'Ultimo mese' },
    { value: '3M', label: 'Ultimi 3 mesi' },
    { value: '6M', label: 'Ultimi 6 mesi' },
    { value: '1Y', label: 'Ultimo anno' },
    { value: 'all', label: 'Tutto' }
  ];

  const getStartDate = (period) => {
    const today = new Date();
    switch (period) {
      case '1M':
        return new Date(today.setMonth(today.getMonth() - 1));
      case '3M':
        return new Date(today.setMonth(today.getMonth() - 3));
      case '6M':
        return new Date(today.setMonth(today.getMonth() - 6));
      case '1Y':
        return new Date(today.setFullYear(today.getFullYear() - 1));
      default:
        return null;
    }
  };

  const handlePeriodChange = (period) => {
    const startDate = getStartDate(period);
    onFilterChange({
      ...filters,
      period,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Periodo
          </label>
          <div className="flex gap-2">
            {periodi.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handlePeriodChange(value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.period === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date personalizzate
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                period: 'custom',
                startDate: e.target.value
              })}
              className="px-2 py-1 border rounded"
            />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                period: 'custom',
                endDate: e.target.value
              })}
              className="px-2 py-1 border rounded"
            />
          </div>
        </div>

        {(filters.startDate || filters.endDate) && (
          <button
            onClick={() => onFilterChange({
              period: 'all',
              startDate: null,
              endDate: null
            })}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Reset filtri
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;