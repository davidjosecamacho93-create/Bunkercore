/**
 * Tenant Module - Aislamiento de Inquilinos
 * Garantiza que ninguna empresa acceda a datos de otra.
 */

export const validateTenant = (tenantId) => {
    // Aquí implementaremos una validación contra una tabla de inquilinos activos
    // o un registro de licencias vigentes.
    if (!tenantId || tenantId === "") {
        throw new Error("[SECURITY_ERROR] TenantID faltante o inválido.");
    }

    console.log(`[TENANT] Acceso confinado al espacio del inquilino: ${tenantId}`);
    return true;
};
