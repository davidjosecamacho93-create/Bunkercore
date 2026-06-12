import 'dotenv/config';
console.log("--- TEST DE CARGA ---");
console.log("¿La clave existe?:", !!process.env.ENCRYPTION_KEY);
console.log("Clave detectada:", process.env.ENCRYPTION_KEY ? "CARGADA" : "NO ENCONTRADA");
