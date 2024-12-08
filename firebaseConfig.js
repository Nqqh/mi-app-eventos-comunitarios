// firebaseConfig.js
// Importar las funciones necesarias de Firebase SDK
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase proporcionada en Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD_ib6djzArvgZnb6JycAwVuN6XaUFE_h4",
    authDomain: "mi-app-eventos-comunitarios.firebaseapp.com",
    projectId: "mi-app-eventos-comunitarios",
    storageBucket: "mi-app-eventos-comunitarios.firebasestorage.app",
    messagingSenderId: "190972063790",
    appId: "1:190972063790:web:19d6ece94031ca4a0b2fbf"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar los servicios para usarlos en otros archivos
export { auth, db };
