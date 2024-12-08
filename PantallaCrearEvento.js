// pantallas/PantallaCrearEvento.js
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { crearEvento } from '../servicios/servicioEventos';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const esquemaValidacion = Yup.object().shape({
  titulo: Yup.string().required('El título es obligatorio'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  fecha: Yup.string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/,
      'La fecha debe tener el formato DD/MM/AAAA'
    )
    .required('La fecha es obligatoria'),
  ubicacion: Yup.string().required('La ubicación es obligatoria'),
});

const formatearFecha = (texto) => {
  let fecha = texto.replace(/\D/g, '');
  if (fecha.length > 8) {
    fecha = fecha.slice(0, 8);
  }

  if (fecha.length > 4) {
    fecha = `${fecha.slice(0, 2)}/${fecha.slice(2, 4)}/${fecha.slice(4)}`;
  } else if (fecha.length > 2) {
    fecha = `${fecha.slice(0, 2)}/${fecha.slice(2)}`;
  }

  return fecha;
};

const PantallaCrearEvento = ({ navigation }) => {
  const manejarCrearEvento = async (values, { setSubmitting, setErrors, resetForm }) => {
    const nuevoEvento = {
      titulo: values.titulo,
      descripcion: values.descripcion,
      fecha: values.fecha,
      ubicacion: values.ubicacion,
      asistentes: [],
    };
    const respuesta = await crearEvento(nuevoEvento);
    setSubmitting(false);

    if (respuesta.success) {
      Alert.alert('Evento Creado', 'El evento ha sido creado exitosamente.');
      resetForm();
      navigation.goBack();
    } else {
      console.error(respuesta.error);
      setErrors({ general: 'Hubo un problema al crear el evento' });
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} /> 
        <Appbar.Content title="Crear Evento" />
      </Appbar.Header>
      <View style={styles.container}>
        <Formik
          initialValues={{ titulo: '', descripcion: '', fecha: '', ubicacion: '' }}
          validationSchema={esquemaValidacion}
          onSubmit={manejarCrearEvento}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <>
              <TextInput
                label="Título"
                value={values.titulo}
                onChangeText={handleChange('titulo')}
                onBlur={handleBlur('titulo')}
                style={styles.input}
                error={touched.titulo && errors.titulo ? true : false}
              />
              {touched.titulo && errors.titulo ? (
                <Text style={styles.error}>{errors.titulo}</Text>
              ) : null}

              <TextInput
                label="Descripción"
                value={values.descripcion}
                onChangeText={handleChange('descripcion')}
                onBlur={handleBlur('descripcion')}
                style={styles.input}
                error={touched.descripcion && errors.descripcion ? true : false}
                multiline
              />
              {touched.descripcion && errors.descripcion ? (
                <Text style={styles.error}>{errors.descripcion}</Text>
              ) : null}

              <TextInput
                label="Fecha (DD/MM/AAAA)"
                value={values.fecha}
                onChangeText={(texto) => {
                  const fechaFormateada = formatearFecha(texto);
                  setFieldValue('fecha', fechaFormateada);
                }}
                onBlur={handleBlur('fecha')}
                style={styles.input}
                error={touched.fecha && errors.fecha ? true : false}
                keyboardType="numeric"
                maxLength={10}
              />
              {touched.fecha && errors.fecha ? (
                <Text style={styles.error}>{errors.fecha}</Text>
              ) : null}

              <TextInput
                label="Ubicación"
                value={values.ubicacion}
                onChangeText={handleChange('ubicacion')}
                onBlur={handleBlur('ubicacion')}
                style={styles.input}
                error={touched.ubicacion && errors.ubicacion ? true : false}
              />
              {touched.ubicacion && errors.ubicacion ? (
                <Text style={styles.error}>{errors.ubicacion}</Text>
              ) : null}

              {errors.general && <Text style={styles.error}>{errors.general}</Text>}

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.button}
              >
                Crear Evento
              </Button>
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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

export default PantallaCrearEvento;
