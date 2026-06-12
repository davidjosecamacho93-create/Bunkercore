import { sql } from './db.js'; // Tu conexión real

async function runIntegrityCheck() {
    try {
        // Validación real de conexión
        const result = await sql`SELECT 1`;
        if (result.length > 0) {
            console.log("[OK] Base de datos conectada.");
        }
        
        // Validación de variables de entorno (claves de cifrado)
        if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 64) {
            throw new Error("Clave de cifrado ausente o insegura");
        }
        console.log("[OK] Entorno de seguridad verificado.");
        process.exit(0);
    } catch (e) {
        console.error("[ERROR CRÍTICO] " + e.message);
        process.exit(1);
    }
}
runIntegrityCheck();
