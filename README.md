# Nombre del Proyecto

**Aplicación de Gestión de Eventos Comunitarios**

## Descripción General

Esta aplicación móvil permite a una comunidad local organizar, asistir y comentar eventos y actividades comunitarias. Los usuarios pueden crear nuevos eventos, explorarlos, confirmar su asistencia, dejar comentarios, calificar, visualizar estadísticas de participación y recibir recordatorios a través de notificaciones locales, promoviendo así un mayor involucramiento en las actividades locales.

## Funcionalidades Principales

1. **Autenticación:**
   - Registro e inicio de sesión con correo electrónico y contraseña, creando automáticamente un documento de usuario en Firestore.
2. **Gestión de Eventos:**

   - Crear Eventos: Registra en Firestore documentos que representan eventos, incluyendo campos como título, descripción, fecha formateada, ubicación y asistentes.
   - Ver Eventos Disponibles: Recupera la lista de eventos almacenados en Firestore y la muestra en una lista, actualizándola al reenfocar la pantalla con `useIsFocused`.
   - Confirmar Asistencia: Actualiza el documento del evento agregando el ID del usuario al array de asistentes y registra el evento en el historial del usuario.

3. **Interacción Social:**

   - Comentarios y Calificaciones: Almacena en subcolecciones de Firestore los comentarios y calificaciones que los usuarios dejan a cada evento.
   - Compartir Evento: Utiliza la API de `Share` en React Native para difundir la información del evento (título, fecha, ubicación) a otras aplicaciones.

4. **Historial y Estadísticas:**

   - Historial de Eventos: Obtiene desde Firestore los eventos a los que el usuario ha asistido, mostrando esta información al reenfocar la pantalla.
   - Estadísticas de Participación: Calcula la cantidad de asistentes y el promedio de calificaciones consultando los datos en Firestore, actualizando la vista al reenfocar la pantalla.

5. **Notificaciones Locales:**

   - Tras confirmar la asistencia a un evento cuya fecha está próxima, se programa una notificación local que se disparará cercanamente a la fecha prevista, recordando al usuario el evento.

6. **UI/UX:**
   - Uso de React Native Paper para componentes estilizados y coherentes.
   - Encabezados personalizados sin doble encabezado.
   - Botón de retroceso (Appbar.BackAction) en las pantallas "Detalle del Evento" y "Crear Evento" para una navegación más intuitiva.
   - Ocultado del teclado al agregar comentarios mediante `TouchableWithoutFeedback`.
   - Actualización automática de pantallas al obtener el foco (`useIsFocused`), asegurando datos siempre vigentes.

## Tecnologías Utilizadas

- React Native (con Expo)
- Firebase (Auth, Firestore)
- expo-notifications
- React Navigation
- React Native Paper
- Formik y Yup

## Requisitos Previos

- Node.js y npm o Yarn
- Expo CLI instalado
- Configuración básica de Firebase (Auth, Firestore)
- Dispositivo físico o emulador (se recomienda dispositivo físico para notificaciones)

## Instalación

1. Clona el repositorio:  
   `git clone https://github.com/Nqqh/mi-app-eventos-comunitarios.git`  
   `cd mi-app-eventos-comunitarios`

2. Instala las dependencias:  
   `npm install`

3. Inicia el servidor de desarrollo:  
   `expo start`

4. Escanea el código QR con la app Expo Go en tu dispositivo.

## Uso

- Inicia sesión o regístrate con tu correo y contraseña.
- Desde "Eventos Disponibles" crea un nuevo evento o selecciona uno existente para ver sus detalles.
- Confirma tu asistencia en "Detalle del Evento" y posteriormente recibirás una notificación local cercana a la fecha del evento.
- Desplázate hacia abajo para agregar comentarios y calificaciones.
- Utiliza el botón de "Compartir Evento" para difundir la información en otras aplicaciones.

## Licencia

- El código fuente se distribuye bajo la licencia MIT (ver `LICENSE`).
- La documentación, imágenes y mockups se publican bajo CC0 (ver `LICENSE-CC0.md`), permitiendo su uso libre sin restricciones.

## Mockups y Documentación

- Diseños (Figma): [[Enlace aquí](https://www.figma.com/design/kBAfQ46fAUb1iLGsRVlcwC/Proyecto-DPS)]
- Tablero de Tareas (Trello): [Enlace aquí](https://trello.com/invite/b/674e80bdc7ce2eb45fba8496/ATTI2574ae07befeaf7f25d42f0578b6e63cB0A50F35/reactnative-dps)]
- Manual de Usuario: [Enlace aquí](https://drive.google.com/file/d/1BNcN6TK5IEIn3_f7jj36um4nm7I5ZXDr/view?usp=sharing)]
- Manual Técnico: [Enlace aquí](https://drive.google.com/file/d/1sVquNKFvziqBLp8w9mkdXgw3pRVscXSa/view?usp=sharing)]

## Contacto y Contribuciones

**Colaboradores (Roles Scrum):**

- Nelson Vicente Luna Hernández: Product Owner
- Henry Vladimir Nájera Guerra: Scrum Master
- Jonathan Rafael Señora Reyes: Desarrollo
- Jarly Leonel Vigil Velásquez: Desarrollo

Se aceptan contribuciones mediante pull requests, issues y sugerencias.

## Referencias

- Guía de publicación del BID: [https://el-bid.github.io/guia-de-publicacion/documents/documentacion/](https://el-bid.github.io/guia-de-publicacion/documents/documentacion/)
- Expo Notifications: [https://docs.expo.dev/versions/latest/sdk/notifications/](https://docs.expo.dev/versions/latest/sdk/notifications/)
- React Native Paper: [https://callstack.github.io/react-native-paper/](https://callstack.github.io/react-native-paper/)
- Firebase para React Native: [https://rnfirebase.io/](https://rnfirebase.io/)
- React Navigation: [https://reactnavigation.org/](https://reactnavigation.org/)
