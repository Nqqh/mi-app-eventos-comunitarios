// pantallas/PantallaEventosDisponibles.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Appbar } from 'react-native-paper';
import { obtenerEventos } from '../servicios/servicioEventos';
import { useIsFocused } from '@react-navigation/native'; // Importar useIsFocused

const PantallaEventosDisponibles = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused(); // Hook para saber si la pantalla está enfocada

  const cargarEventos = async () => {
    setLoading(true);
    const eventosRespuesta = await obtenerEventos();
    setLoading(false);
    if (eventosRespuesta.success) {
      setEventos(eventosRespuesta.data);
    } else {
      console.error(eventosRespuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
    }
  };

  // Efecto que se dispara cada vez que la pantalla toma foco
  useEffect(() => {
    if (isFocused) {
      cargarEventos();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('Evento', { evento: item })}>
      <Card.Title title={item.titulo} />
      <Card.Content>
        <Text>{item.fecha}</Text>
        <Text>{item.ubicacion}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Eventos Disponibles" />
      </Appbar.Header>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CrearEvento')}
          style={styles.button}
        >
          Crear Evento
        </Button>

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
  card: {
    marginVertical: 4,
  },
  button: {
    marginVertical: 8,
  },
  loading: {
    marginVertical: 20,
  },
});

export default PantallaEventosDisponibles;
