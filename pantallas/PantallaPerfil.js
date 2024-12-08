// pantallas/PantallaPerfil.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { cerrarSesion } from '../servicios/servicioAuth';

const PantallaPerfil = ({ navigation }) => {
  const user = auth.currentUser;

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigation.replace('Auth');
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Perfil" />
      </Appbar.Header>
      <View style={styles.container}>
        <Image
          source={require('../assets/profile_placeholder.png')} // Asegúrate de tener una imagen en esta ruta
          style={styles.avatar}
        />
        <Text style={styles.email}>{user.email}</Text>
        <Button
          mode="contained"
          onPress={manejarCerrarSesion}
          style={styles.button}
        >
          Cerrar Sesión
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: '60%',
  },
});

export default PantallaPerfil;
