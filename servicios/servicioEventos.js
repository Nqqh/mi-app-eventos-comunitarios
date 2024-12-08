// servicios/servicioEventos.js
import { db, auth } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  getDoc 
} from 'firebase/firestore';

// Obtener todos los eventos
export const obtenerEventos = async () => {
  try {
    const eventos = [];
    const querySnapshot = await getDocs(collection(db, 'eventos'));
    querySnapshot.forEach((documento) => {
      eventos.push({ id: documento.id, ...documento.data() });
    });
    return { success: true, data: eventos };
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return { success: false, error };
  }
};

// Crear un nuevo evento con campo asistentes inicializado como array vacío
export const crearEvento = async (evento) => {
  try {
    const eventoConAsistentes = {
      ...evento,
      asistentes: [], // Inicializar asistentes como array vacío
    };
    await addDoc(collection(db, 'eventos'), eventoConAsistentes);
    return { success: true };
  } catch (error) {
    console.error('Error al crear evento:', error);
    return { success: false, error };
  }
};

// Confirmar asistencia de un usuario y agregar al historial
export const confirmarAsistencia = async (eventoId) => {
  try {
    const userId = auth.currentUser.uid;
    const eventoRef = doc(db, 'eventos', eventoId);

    // Actualizar lista de asistentes del evento
    await updateDoc(eventoRef, {
      asistentes: arrayUnion(userId),
    });

    // Agregar evento al historial del usuario
    const usuarioRef = doc(db, 'usuarios', userId);
    await updateDoc(usuarioRef, {
      historial: arrayUnion(eventoId),
    });

    return { success: true };
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    return { success: false, error };
  }
};

// Obtener estadísticas de un evento (número de asistentes)
export const obtenerEstadisticasEvento = async (eventoId) => {
  try {
    const eventoRef = doc(db, 'eventos', eventoId);
    const eventoSnapshot = await getDoc(eventoRef);

    if (eventoSnapshot.exists()) {
      const eventoData = eventoSnapshot.data();
      const asistentes = eventoData.asistentes || []; // Manejar asistentes undefined
      return { success: true, data: asistentes.length };
    } else {
      return { success: false, error: 'Evento no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { success: false, error };
  }
};

// Obtener el historial de eventos de un usuario
export const obtenerHistorialUsuario = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const usuarioRef = doc(db, 'usuarios', user.uid);
    const usuarioSnap = await getDoc(usuarioRef);

    if (usuarioSnap.exists()) {
      const userData = usuarioSnap.data();
      return { success: true, data: userData.historial || [] };
    } else {
      // Crear documento de usuario si no existe
      await addDoc(collection(db, 'usuarios'), {
        email: user.email || 'Desconocido',
        historial: [],
      });
      return { success: true, data: [] };
    }
  } catch (error) {
    console.error('Error al obtener historial del usuario:', error);
    return { success: false, error };
  }
};

// Obtener calificaciones promedio de un evento
export const obtenerCalificacionPromedio = async (eventoId) => {
  try {
    const comentariosRef = collection(db, 'eventos', eventoId, 'comentarios');
    const snapshot = await getDocs(comentariosRef);
    const calificaciones = snapshot.docs.map(doc => doc.data().calificacion);
    if (calificaciones.length === 0) return 'N/A';
    const suma = calificaciones.reduce((acc, curr) => acc + curr, 0);
    const promedio = (suma / calificaciones.length).toFixed(1);
    return promedio;
  } catch (error) {
    console.error('Error al obtener calificación promedio:', error);
    return 'N/A';
  }
};
