// Funzione che gestisce l'export delle transazioni
export const exportToCSV = (transactions, dateRange = null) => {
    // Se c'è un range di date, filtra le transazioni
    let transactionsToExport = transactions;
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      transactionsToExport = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }
  
    // Formatta le date e i numeri per l'Italia
    const formatDate = (date) => new Date(date).toLocaleDateString('it-IT');
    const formatAmount = (amount) => amount.toString().replace('.', ',');
  
    // Prepara l'header del CSV
    const headers = ['Data', 'Tipo', 'Categoria', 'Importo', 'Note'];
    
    // Prepara le righe dei dati
    const rows = transactionsToExport.map(t => [
      formatDate(t.date),
      t.type === 'income' ? 'Entrata' : 'Uscita',
      t.category,
      formatAmount(t.amount),
      t.notes || ''
    ]);
  
    // Combina header e righe
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
  
    // Crea il Blob e il link per il download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Imposta il nome del file
    const now = new Date();
    const fileName = dateRange 
      ? `transazioni_${dateRange.startDate}_${dateRange.endDate}.csv`
      : `transazioni_complete_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.csv`;
  
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };