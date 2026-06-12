import { checkAuthStatus } from './check_auth.js';

// Esta función es la que llamará tu botón de "Accesar"
export const requestBiometricAccess = async () => {
    console.log("Solicitando acceso biométrico...");
    
    // 1. Aquí disparas el script que pide la huella
    // En el mundo real, esto lo lanzas con 'child_process' de Node
    // por ahora, asumimos que el script de huella ya actualizó auth.json
    
    const isAuthorized = checkAuthStatus();
    
    if (isAuthorized) {
        console.log("Interfaz: Acceso concedido, desbloqueando panel principal.");
        // Aquí podrías cambiar el estado de tu interfaz, por ejemplo:
        // UI.showPanel('Dashboard');
        return true;
    } else {
        console.log("Interfaz: Acceso rechazado, intentando de nuevo...");
        // UI.showError('Huella no reconocida');
        return false;
    }
};

