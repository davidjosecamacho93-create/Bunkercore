import { encryptData, decryptData } from '../src/core/crypto/index.js';

async function testCrypto() {
    console.log("--- Iniciando Test de Criptografía ---");
    
    const originalData = {
        secret: "Mi contraseña SaaS super secreta",
        amount: 1000,
        customer: "Empresa Zero-Trust"
    };

    try {
        console.log("Datos Originales:", originalData);

        // 1. Probar Cifrado
        const encrypted = await encryptData(originalData);
        console.log("\nBlob Cifrado (lo que se guarda en la DB):");
        console.log(encrypted);

        // 2. Probar Descifrado
        const decrypted = await decryptData(encrypted);
        console.log("\nDatos Descifrados:");
        console.log(decrypted);

        // 3. Verificación
        if (JSON.stringify(originalData) === JSON.stringify(decrypted)) {
            console.log("\n✅ ÉXITO: Los datos coinciden perfectamente.");
        } else {
            console.log("\n❌ ERROR: Los datos descifrados no coinciden.");
        }

    } catch (error) {
        console.error("\n❌ TEST FALLIDO:", error.message);
    }
}

testCrypto();
