/**
 * Ledger Module - El Notario Digital
 * Registra cada movimiento de forma inmutable.
 */

export const recordEvent = async (tenantId, action, summary) => {
    const timestamp = new Date().toISOString();
    
    // Aquí creamos una entrada que luego se encadenará.
    // Esto es lo que el dueño verá en sus reportes de auditoría.
    const entry = {
        tenantId,
        timestamp,
        action,
        summary,
        // Un hash simple para asegurar integridad (en producción será un SHA-256)
        fingerprint: Buffer.from(`${tenantId}${timestamp}${action}`).toString('hex').slice(0, 16)
    };

    console.log(`[LEDGER] Evento registrado: ${entry.fingerprint}`);
    
    // Aquí es donde en un sistema real guardaríamos en la DB de auditoría
    return entry;
};
