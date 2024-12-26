import { 
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile
  } from 'firebase/auth';
  import { auth } from '../config/firebase';
  
  // Login
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  };
  
  // Logout
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Errore durante il logout:', error);
      throw error;
    }
  };
  
  // Registrazione
  export const registerUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw error;
    }
  };