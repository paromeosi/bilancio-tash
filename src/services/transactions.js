import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collezione delle transazioni
const transactionsRef = collection(db, 'transactions');

class TransactionService {
  // Ottieni le transazioni per un utente
  async getTransactions(userId) {
    try {
      // Semplifichiamo la query rimuovendo temporaneamente l'orderBy
      const q = query(
        transactionsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Errore nel recupero delle transazioni:', error);
      throw error;
    }
  }

  // Aggiungi una transazione
  async addTransaction(data) {
    try {
      const docRef = await addDoc(transactionsRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log("Transaction added with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Errore nell\'aggiunta della transazione:', error);
      throw error;
    }
  }

  // Aggiorna una transazione
  async updateTransaction(id, data) {
    try {
      const docRef = doc(transactionsRef, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Errore nell\'aggiornamento della transazione:', error);
      throw error;
    }
  }

  // Elimina una transazione
  async deleteTransaction(id) {
    try {
      const docRef = doc(transactionsRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Errore nell\'eliminazione della transazione:', error);
      throw error;
    }
  }
}

export default new TransactionService();