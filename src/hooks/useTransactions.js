import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Carica le transazioni
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(user.uid);
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Errore nel caricamento delle transazioni');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Aggiungi una transazione
  const addTransaction = async (transactionData) => {
    if (!user) return;

    try {
      console.log('Adding transaction:', transactionData);
      const enrichedData = {
        ...transactionData,
        userId: user.uid,
        timestamp: new Date()
      };
      console.log('Enriched data:', enrichedData);
      await transactionService.addTransaction(enrichedData);
      await fetchTransactions();
    } catch (err) {
      console.error('Error in addTransaction:', err);
      throw new Error('Errore nell\'aggiunta della transazione');
    }
  };

  // Modifica una transazione
  const updateTransaction = async (id, transactionData) => {
    if (!user) return;

    try {
      await transactionService.updateTransaction(id, transactionData);
      await fetchTransactions();
    } catch (err) {
      throw new Error('Errore nella modifica della transazione');
    }
  };

  // Elimina una transazione
  const deleteTransaction = async (id) => {
    if (!user) return;

    try {
      await transactionService.deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      throw new Error('Errore nell\'eliminazione della transazione');
    }
  };

  // Calcola i totali
  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          acc.totalIncome += amount;
        } else {
          acc.totalExpense += amount;
        }
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  };

  // Carica le transazioni quando cambia l'utente
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    calculateTotals,
    refresh: fetchTransactions
  };
};

export default useTransactions;