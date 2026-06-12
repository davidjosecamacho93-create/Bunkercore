-- Script de Configuración Multitenant para Bunkercore
-- Ejecutar este SQL en la consola de Neon.tech

-- 1. Crear tabla de inquilinos (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Asegurar que inventory_records tenga tenant_id y habilitar RLS
ALTER TABLE inventory_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE inventory_records ENABLE ROW LEVEL SECURITY;

-- 4. Crear Política de Aislamiento
-- Esta política impide que un usuario vea datos que no pertenezcan a su tenant_id.
-- En un SaaS real, el app_user_id se pasaría mediante una variable de sesión.
CREATE POLICY tenant_isolation_policy ON inventory_records
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- 5. Ejemplo de cómo usar desde Node.js:
-- await sql`SET LOCAL app.current_tenant_id = ${tenantId}`;
-- await sql`SELECT * FROM inventory_records`;
