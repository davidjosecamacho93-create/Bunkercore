import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export const db = {
    saveData: async (tenantId, payload, fingerprint) => {
        await sql`
            INSERT INTO inventory_records (tenant_id, secure_data, fingerprint)
            VALUES (${tenantId}, ${payload}, ${fingerprint})
        `;
    },

    getData: async (tenantId) => {
        // Obtenemos el registro más reciente para este tenant
        const result = await sql`
            SELECT secure_data FROM inventory_records 
            WHERE tenant_id = ${tenantId} 
            ORDER BY created_at DESC LIMIT 1
        `;
        return result[0]?.secure_data;
    }
};
