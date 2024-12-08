// componentes/Comentario.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatearFecha } from '../utils/utilsFechas';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Objeto de caché fuera del componente para persistir entre renders
const emailCache = {};

const Comentario = ({ comentario }) => {
  const [usuarioEmail, setUsuarioEmail] = useState('Cargando...');

  useEffect(() => {
    const obtenerEmailUsuario = async () => {
      if (emailCache[comentario.usuarioId]) {
        setUsuarioEmail(emailCache[comentario.usuarioId]);
        return;
      }

      try {
        const usuarioRef = doc(db, 'usuarios', comentario.usuarioId);
        const usuarioSnap = await getDoc(usuarioRef);
        if (usuarioSnap.exists()) {
          const userData = usuarioSnap.data();
          const email = userData.email || 'Desconocido';
          emailCache[comentario.usuarioId] = email; // Almacenar en caché
          setUsuarioEmail(email);
        } else {
          emailCache[comentario.usuarioId] = 'Desconocido';
          setUsuarioEmail('Desconocido');
        }
      } catch (error) {
        console.error('Error al obtener el email del usuario:', error);
        emailCache[comentario.usuarioId] = 'Desconocido';
        setUsuarioEmail('Desconocido');
      }
    };

    obtenerEmailUsuario();
  }, [comentario.usuarioId]);

  return (
    <View style={styles.comentarioCard}>
      <Text style={styles.comentarioUsuario}>Usuario: {usuarioEmail}</Text>
      <Text>Calificación: {comentario.calificacion} ⭐️</Text>
      <Text>{comentario.comentario}</Text>
      <Text style={styles.fechaComentario}>{formatearFecha(comentario.fecha.toDate())}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  comentarioCard: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  comentarioUsuario: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fechaComentario: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default Comentario;
