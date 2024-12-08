// pantallas/PantallaAuth.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import FormularioAuth from '../componentes/FormularioAuth';
import { registro, login } from '../servicios/servicioAuth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-native-paper';

const esquemaValidacion = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

const PantallaAuth = ({ navigation }) => {
  const [esRegistro, setEsRegistro] = useState(false);

  const manejarAuth = async (values, { setSubmitting, setErrors }) => {
    let respuesta;
    if (esRegistro) {
      respuesta = await registro(values.email, values.password);
      if (respuesta.success) {
        Alert.alert('Registro Exitoso', 'Tu cuenta ha sido creada correctamente.');
      }
    } else {
      respuesta = await login(values.email, values.password);
    }

    setSubmitting(false);

    if (respuesta.success) {
      navigation.replace('Inicio');
    } else {
      setErrors({ general: respuesta.error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{esRegistro ? 'Registro' : 'Inicio de Sesión'}</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={esquemaValidacion}
        onSubmit={manejarAuth}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <FormularioAuth
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              values={values}
              errors={errors}
              touched={touched}
              esRegistro={esRegistro}
            />
            {errors.general && <Text style={styles.error}>{errors.general}</Text>}
            <Button
              onPress={() => {
                setEsRegistro(!esRegistro);
              }}
              style={styles.link}
            >
              {esRegistro
                ? '¿Ya tienes una cuenta? Inicia Sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

export default PantallaAuth;
