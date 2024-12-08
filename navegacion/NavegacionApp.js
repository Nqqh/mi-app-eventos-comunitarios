// navegacion/NavegacionApp.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PantallaAuth from '../pantallas/PantallaAuth';
import PantallaEvento from '../pantallas/PantallaEvento';
import PantallaCrearEvento from '../pantallas/PantallaCrearEvento';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PantallaEventosDisponibles from '../pantallas/PantallaEventosDisponibles';
import PantallaEstadisticas from '../pantallas/PantallaEstadisticas';
import PantallaHistorial from '../pantallas/PantallaHistorial';
import PantallaPerfil from '../pantallas/PantallaPerfil';

import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Eventos"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Eventos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Estadísticas') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // Ocultar el header en las pestañas
      })}
    >
      <Tab.Screen name="Eventos" component={PantallaEventosDisponibles} />
      <Tab.Screen name="Estadísticas" component={PantallaEstadisticas} />
      <Tab.Screen name="Historial" component={PantallaHistorial} />
      <Tab.Screen name="Perfil" component={PantallaPerfil} />
    </Tab.Navigator>
  );
};

const NavegacionApp = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const suscriptor = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return suscriptor;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Ocultar el header en todas las pantallas
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen name="Inicio" component={TabNavigator} />
            <Stack.Screen name="Evento" component={PantallaEvento} />
            <Stack.Screen name="CrearEvento" component={PantallaCrearEvento} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={PantallaAuth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavegacionApp;
