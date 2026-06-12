import { readFileSync } from 'fs';

export function checkAuthStatus() {
    try {
        // Leemos el archivo generado por Termux
        const data = readFileSync('auth.json', 'utf8');
        const result = JSON.parse(data);
        
        // Validamos la respuesta del sensor
        if (result.auth_result === "AUTH_RESULT_SUCCESS") {
            console.log("✅ Acceso permitido: Huella válida detectada.");
            return true;
        } else {
            console.log("❌ Acceso denegado: Firma incorrecta o falla de sensor.");
            return false;
        }
    } catch (err) {
        console.error("⚠️ Error: No se encontró el ticket de autenticación (auth.json).");
        return false;
    }
}
