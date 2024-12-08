// pantallas/PantallaInicio.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import {
  obtenerEventos,
  obtenerEstadisticasEvento,
  obtenerHistorialUsuario,
  obtenerCalificacionPromedio,
} from '../servicios/servicioEventos';
import TarjetaEvento from '../componentes/TarjetaEvento';
import { cerrarSesion } from '../servicios/servicioAuth';
import { Button, Text, ActivityIndicator, Divider } from 'react-native-paper';

const PantallaInicio = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);

    // Obtener eventos
    const eventosRespuesta = await obtenerEventos();
    if (eventosRespuesta.success) {
      setEventos(eventosRespuesta.data);
      await cargarEstadisticas(eventosRespuesta.data);
    } else {
      console.error(eventosRespuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
    }

    // Obtener historial
    const historialRespuesta = await obtenerHistorialUsuario();
    if (historialRespuesta.success) {
      setHistorial(historialRespuesta.data);
    } else {
      console.error(historialRespuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar tu historial de eventos.');
    }

    setLoading(false);
  };

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

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigation.replace('Auth');
  };

  // Filtrar eventos que el usuario ha asistido
  const eventosHistorial = eventos.filter((evento) => historial.includes(evento.id));

  return (
    <View style={styles.container}>
      <Button mode="outlined" onPress={manejarCerrarSesion} style={styles.button}>
        Cerrar Sesión
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('CrearEvento')}
        style={styles.button}
      >
        Crear Evento
      </Button>

      {/* Sección de Eventos Disponibles */}
      <Text style={styles.subtitulo}>Eventos Disponibles</Text>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TarjetaEvento
              evento={item}
              onPress={() => navigation.navigate('Evento', { evento: item })}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}

      {/* Sección de Estadísticas de Participación */}
      <Text style={styles.subtitulo}>Estadísticas de Participación</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.estadisticaCard}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text>Asistentes: {estadisticas[item.id]?.asistentes || 0}</Text>
            <Text>
              Calificación Promedio: {estadisticas[item.id]?.calificacionPromedio || 'N/A'}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      {/* Sección de Historial de Eventos */}
      <Text style={styles.subtitulo}>Historial de Eventos</Text>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loading} />
      ) : eventosHistorial.length === 0 ? (
        <Text>No has asistido a ningún evento aún.</Text>
      ) : (
        <FlatList
          data={eventosHistorial}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TarjetaEvento
              evento={item}
              onPress={() => navigation.navigate('Evento', { evento: item })}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  estadisticaCard: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
  loading: {
    marginVertical: 20,
  },
});

export default PantallaInicio;
