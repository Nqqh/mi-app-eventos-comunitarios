// servicios/servicioComentarios.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// Función para agregar un comentario y calificación a un evento
export const agregarComentario = async (eventoId, comentario, calificacion) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Debe estar logueado para comentar');
  }

  try {
    const comentariosRef = collection(db, 'eventos', eventoId, 'comentarios');
    await addDoc(comentariosRef, {
      comentario,
      calificacion,
      usuarioId: user.uid,
      fecha: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    return { success: false, error };
  }
};

// Función para obtener todos los comentarios de un evento
export const obtenerComentarios = async (eventoId) => {
  try {
    const comentariosRef = collection(db, 'eventos', eventoId, 'comentarios');
    const snapshot = await getDocs(comentariosRef);
    const comentarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: comentarios };
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return { success: false, error };
  }
};
