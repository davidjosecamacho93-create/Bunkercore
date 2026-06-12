import fs from 'fs';

console.log("--- BUNKERSCORE: DIAGNÓSTICO REAL ---");

// 1. Verificación de entorno
console.log("[1/3] Verificando variables de entorno...");
if (!process.env.ENCRYPTION_KEY) {
    console.log("  -> ERROR: ENCRYPTION_KEY no está definida.");
} else {
    console.log("  -> OK: ENCRYPTION_KEY configurada.");
}

// 2. Verificación de archivos
console.log("[2/3] Verificando existencia de server.js...");
if (fs.existsSync('./server.js')) {
    console.log("  -> OK: server.js encontrado.");
} else {
    console.log("  -> ERROR: server.js no encontrado.");
}

// 3. Prueba de carga de módulos (Usando import dinámico)
console.log("[3/3] Probando librerías...");
try {
    await import('@simplewebauthn/server');
    console.log("  -> OK: @simplewebauthn/server detectado.");
} catch (e) {
    console.log("  -> ERROR: @simplewebauthn/server no cargado. Detalles:", e.message);
}

console.log("--- DIAGNÓSTICO FINALIZADO ---");
