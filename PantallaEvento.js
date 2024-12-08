// pantallas/PantallaEvento.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { confirmarAsistencia } from '../servicios/servicioEventos';
import { agregarComentario, obtenerComentarios } from '../servicios/servicioComentarios';
import { auth } from '../firebaseConfig';
import Comentario from '../componentes/Comentario';
import {
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  Divider,
  Appbar,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Notifications from 'expo-notifications';

const esquemaValidacionComentario = Yup.object().shape({
  comentario: Yup.string().required('El comentario es obligatorio'),
  calificacion: Yup.number()
    .required('La calificación es obligatoria')
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
});

const PantallaEvento = ({ route, navigation }) => {
  const [evento, setEvento] = useState(route.params.evento);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    setLoading(true);
    const respuesta = await obtenerComentarios(evento.id);
    setLoading(false);
    if (respuesta.success) {
      setComentarios(respuesta.data);
    } else {
      console.error(respuesta.error);
      Alert.alert('Error', 'Hubo un problema al cargar los comentarios');
    }
  };

  const manejarConfirmacion = async () => {
    const userId = auth.currentUser.uid;

    if (evento.asistentes && evento.asistentes.includes(userId)) {
      Alert.alert('Información', 'Ya estás registrado como asistente de este evento.');
      return;
    }

    setLoading(true);
    const respuesta = await confirmarAsistencia(evento.id);
    setLoading(false);

    if (respuesta.success) {
      Alert.alert('Éxito', 'Asistencia confirmada');
      setEvento((prevEvento) => ({
        ...prevEvento,
        asistentes: [...(prevEvento.asistentes || []), userId],
      }));

      // Ejemplo: Notificación local después de confirmar asistencia
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Recordatorio!',
          body: `Falta 1 día para el evento "${evento.titulo}". ¡No te lo pierdas!`,
        },
        trigger: { seconds: 5 },
      });

    } else {
      console.error(respuesta.error);
      Alert.alert('Error', 'Hubo un problema al confirmar asistencia');
    }
  };

  const manejarAgregarComentario = async (values, { setSubmitting, resetForm }) => {
    Keyboard.dismiss();
    setLoading(true);
    const respuesta = await agregarComentario(
      evento.id,
      values.comentario,
      parseInt(values.calificacion)
    );
    setLoading(false);
    setSubmitting(false);

    if (respuesta.success) {
      Alert.alert('Éxito', 'Comentario agregado');
      resetForm();
      cargarComentarios();
    } else {
      console.error(respuesta.error);
      Alert.alert('Error', 'Hubo un problema al agregar el comentario');
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} /> 
        <Appbar.Content title="Detalle del Evento" />
      </Appbar.Header>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>{evento.titulo}</Text>
          <Text style={styles.descripcion}>{evento.descripcion}</Text>
          <Text>Fecha: {evento.fecha}</Text>
          <Text>Ubicación: {evento.ubicacion}</Text>
          <Text>Asistentes: {evento.asistentes ? evento.asistentes.length : 0}</Text>
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loading} />
          ) : (
            <Button mode="contained" onPress={manejarConfirmacion} style={styles.button}>
              Confirmar Asistencia
            </Button>
          )}

          <Divider style={{ marginVertical: 16 }} />

          <Text style={styles.subtitulo}>Comentarios</Text>

          <Formik
            initialValues={{ comentario: '', calificacion: '5' }}
            validationSchema={esquemaValidacionComentario}
            onSubmit={manejarAgregarComentario}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <TextInput
                  label="Deja tu comentario"
                  value={values.comentario}
                  onChangeText={handleChange('comentario')}
                  onBlur={handleBlur('comentario')}
                  style={styles.input}
                  error={touched.comentario && errors.comentario ? true : false}
                  multiline
                />
                {touched.comentario && errors.comentario ? (
                  <Text style={styles.error}>{errors.comentario}</Text>
                ) : null}

                <TextInput
                  label="Calificación (1-5)"
                  value={values.calificacion}
                  onChangeText={handleChange('calificacion')}
                  onBlur={handleBlur('calificacion')}
                  keyboardType="numeric"
                  style={styles.input}
                  error={touched.calificacion && errors.calificacion ? true : false}
                />
                {touched.calificacion && errors.calificacion ? (
                  <Text style={styles.error}>{errors.calificacion}</Text>
                ) : null}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.button}
                >
                  Agregar Comentario
                </Button>
              </>
            )}
          </Formik>

          <Divider style={{ marginVertical: 16 }} />

          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loading} />
          ) : (
            comentarios.map((item) => (
              <Comentario key={item.id} comentario={item} />
            ))
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descripcion: {
    textAlign: 'justify',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 12,
  },
  loading: {
    marginVertical: 20,
  },
});

export default PantallaEvento;
