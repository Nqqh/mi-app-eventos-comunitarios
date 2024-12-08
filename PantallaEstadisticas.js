// pantallas/PantallaEstadisticas.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import {
  obtenerEventos,
  obtenerEstadisticasEvento,
  obtenerCalificacionPromedio,
} from '../servicios/servicioEventos';
import { Text, Divider, Appbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

const PantallaEstadisticas = () => {
  const [eventos, setEventos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused(); // Saber si la pantalla está enfocada

  const cargarEstadisticas = async (eventosList) => {
    const stats = {};
    for (const evento of eventosList) {
      try {
        const asistentes = await obtenerEstadisticasEvento(evento.id);
        const calificacionPromedio = await obtenerCalificacionPromedio(evento.id);
        stats[evento.id] = {
          asistentes: asistentes.success ? asistentes.data : 0,
          calificacionPromedio: calificacionPromedio,
        };
      } catch (error) {
        console.error(`Error al obtener estadísticas para el evento ${evento.id}:`, error);
      }
    }
    setEstadisticas(stats);
  };

  const cargarDatos = async () => {
    setLoading(true);

    const eventosRespuesta = await obtenerEventos();
    if (eventosRespuesta.success) {
      setEventos(eventosRespuesta.data);
      await cargarEstadisticas(eventosRespuesta.data);
    } else {
      console.error(eventosRespuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      cargarDatos();
    }
  }, [isFocused]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Estadísticas de Participación" />
      </Appbar.Header>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.estadisticaCard}>
                <Text style={styles.eventoTitulo}>{item.titulo}</Text>
                <Text>Asistentes: {estadisticas[item.id]?.asistentes || 0}</Text>
                <Text>
                  Calificación Promedio: {estadisticas[item.id]?.calificacionPromedio || 'N/A'}
                </Text>
                <Divider style={styles.divider} />
              </View>
            )}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  estadisticaCard: {
    marginBottom: 12,
  },
  eventoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
  divider: {
    marginVertical: 8,
  },
});

export default PantallaEstadisticas;
