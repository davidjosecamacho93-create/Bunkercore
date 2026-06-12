import { verifyIdentity } from './auth/index.js';
import { encryptData, decryptData } from './crypto/index.js';
import { recordEvent } from './ledger/index.js';
import { validateTenant } from './tenants/index.js';
import { db } from './db/index.js';

export const bunkercore = {
    init: () => {
        console.log("Bunkercore: Sistema iniciado y en modo Zero-Trust.");
    },

    processData: async (inputData, tenantId, userSignature) => {
        validateTenant(tenantId);
        if (!(await verifyIdentity(userSignature))) throw new Error("Acceso denegado.");
        const securePayload = await encryptData(inputData, tenantId);
        const event = await recordEvent(tenantId, "DATA_ENCRYPTION", "Procesado.");
        await db.saveData(tenantId, securePayload, event.fingerprint);
        return { status: "SECURED_AND_SAVED", data: securePayload };
    },

    retrieveData: async (tenantId, userSignature) => {
        validateTenant(tenantId); // Ahora sí debería encontrarla
        if (!(await verifyIdentity(userSignature))) throw new Error("Acceso denegado.");
        const secureBlob = await db.getData(tenantId);
        if (!secureBlob) throw new Error("No hay datos encontrados.");
        const data = await decryptData(secureBlob);
        await recordEvent(tenantId, "DATA_RETRIEVAL", "Consulta exitosa.");
        return data;
    }
};

bunkercore.init();
