import { verifyIdentity } from '../core/auth/index.js';
import { encryptData, decryptData } from '../core/crypto/index.js';
import { recordEvent } from '../core/ledger/index.js';
import { validateTenant } from '../core/tenants/index.js';
import { db } from '../core/db/index.js';
// Importamos el guardia desde la raíz
import { checkAuthStatus } from '../../check_auth.js'; 

export const bunkercore = {
    init: () => {
        console.log("Bunkercore: Sistema iniciado y en modo Zero-Trust.");
    },

    processData: async (inputData, tenantId, userSignature) => {
        // --- NUEVO BLINDAJE ---
        if (!checkAuthStatus()) {
            throw new Error("Acceso denegado: Se requiere autenticación biométrica.");
        }
        // ----------------------

        validateTenant(tenantId);
        if (!(await verifyIdentity(userSignature))) throw new Error("Acceso denegado.");
        
        const securePayload = await encryptData(inputData, tenantId);
        const event = await recordEvent(tenantId, "DATA_ENCRYPTION", "Procesado.");
        await db.saveData(tenantId, securePayload, event.fingerprint);
        
        return { status: "SECURED_AND_SAVED", data: securePayload };
    },
    
    retrieveData: async (tenantId, userSignature) => {
        if (!checkAuthStatus()) {
            throw new Error("Acceso denegado: Se requiere autenticación biométrica.");
        }

        validateTenant(tenantId);
        if (!(await verifyIdentity(userSignature))) throw new Error("Acceso denegado.");
        
        const secureBlob = await db.getData(tenantId);
        if (!secureBlob) throw new Error("No hay datos encontrados.");
        
        const data = await decryptData(secureBlob);
        await recordEvent(tenantId, "DATA_RETRIEVAL", "Consulta exitosa.");
        
        return data;
    }
};
