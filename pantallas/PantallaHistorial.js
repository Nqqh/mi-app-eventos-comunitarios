// pantallas/PantallaHistorial.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { obtenerHistorialUsuario, obtenerEventos } from '../servicios/servicioEventos';
import TarjetaEvento from '../componentes/TarjetaEvento';
import { Text, Appbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

const PantallaHistorial = ({ navigation }) => {
  const [eventosHistorial, setEventosHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused(); // Saber si la pantalla está enfocada

  const cargarDatos = async () => {
    setLoading(true);

    const historialRespuesta = await obtenerHistorialUsuario();
    if (historialRespuesta.success) {
      const historial = historialRespuesta.data;

      const eventosRespuesta = await obtenerEventos();
      if (eventosRespuesta.success) {
        const eventos = eventosRespuesta.data;
        const eventosAsistidos = eventos.filter((evento) => historial.includes(evento.id));
        setEventosHistorial(eventosAsistidos);
      } else {
        console.error(eventosRespuesta.error);
        Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
      }
    } else {
      console.error(historialRespuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar tu historial de eventos.');
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
        <Appbar.Content title="Historial de Eventos" />
      </Appbar.Header>
      <View style={styles.container}>
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
  loading: {
    marginVertical: 20,
  },
});

export default PantallaHistorial;
