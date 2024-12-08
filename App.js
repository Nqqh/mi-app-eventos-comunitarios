// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import NavegacionApp from './navegacion/NavegacionApp';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        Alert.alert('Aviso', 'Debes usar un dispositivo físico para recibir notificaciones.');
        return;
      }
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permiso requerido', 'No se otorgaron permisos para notificaciones.');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token Expo Push:', token);
      setExpoPushToken(token);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    registerForPushNotificationsAsync();

    // Listener para notificaciones en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener para cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario tocó la notificación:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <NavegacionApp />;
}
