// servicios/servicioAuth.js
import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const registro = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Crear documento de usuario en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      email: user.email,
      historial: [],
    });

    return { success: true };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, error };
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error };
  }
};

export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error };
  }
};
