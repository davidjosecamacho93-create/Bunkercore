import { bunkercore } from '/data/data/com.termux/files/home/proyectos/bunkercore/index.js';

const runFetchTest = async () => {
    const tenant = "EMPRESA_A";
    const firma = "A".repeat(32);

    console.log("--- PROBANDO RECUPERACIÓN DE DATOS ---");
    try {
        const datos = await bunkercore.retrieveData(tenant, firma);
        console.log("Dato recuperado y descifrado:", datos);
    } catch (err) {
        console.error("Error en la recuperación:", err.message);
    }
};

runFetchTest();
