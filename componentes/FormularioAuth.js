// componentes/FormularioAuth.js
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const FormularioAuth = ({
  handleChange,
  handleBlur,
  handleSubmit,
  values,
  errors,
  touched,
  esRegistro,
}) => {
  return (
    <>
      <TextInput
        label="Correo electrónico"
        value={values.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={touched.email && errors.email ? true : false}
      />
      {touched.email && errors.email ? (
        <Text style={styles.error}>{errors.email}</Text>
      ) : null}

      <TextInput
        label="Contraseña"
        value={values.password}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        secureTextEntry
        style={styles.input}
        error={touched.password && errors.password ? true : false}
      />
      {touched.password && errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 12,
  },
});

export default FormularioAuth;
