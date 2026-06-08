import { bunkercore } from './index.js';

const runTest = async () => {
    console.log("--- INICIANDO SIMULACIÓN DE SEGURIDAD ---");

    const mockData = { item: "Madera_210cm", cantidad: 10 };
    const tenant = "EMPRESA_A";
    const firmaValida = "A".repeat(32); // Firma ficticia de 32 caracteres

    try {
        console.log("\n[TEST 1] Petición válida:");
        const res = await bunkercore.processData(mockData, tenant, firmaValida);
        console.log("Resultado:", res);

        console.log("\n[TEST 2] Petición con firma inválida:");
        await bunkercore.processData(mockData, tenant, "firma_corta");
    } catch (err) {
        console.log("Error capturado correctamente:", err.message);
    }
};

runTest();
