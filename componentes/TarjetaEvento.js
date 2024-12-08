// componentes/TarjetaEvento.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const TarjetaEvento = ({ evento, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title title={evento.titulo} />
      <Card.Content>
        <Text>{evento.fecha}</Text>
        <Text>{evento.ubicacion}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
});

export default TarjetaEvento;
