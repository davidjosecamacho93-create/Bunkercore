// Configuración de variables de entorno para Passkeys
export const PASSKEY_CONFIG = {
  // URL de origen esperada (debe coincidir con el dominio donde se ejecuta)
  origin: process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000',
  // ID de la plataforma RP (Relying Party)
  rpId: process.env.NEXT_PUBLIC_RP_ID || 'localhost',
  // Nombre de la plataforma RP
  rpName: 'BunkerCore V2',
  // Timeout para operaciones WebAuthn (en milisegundos)
  timeout: 60000,
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  // Algoritmos de firma permitidos
  supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  // Nivel de autenticación requerido
  userVerification: 'preferred', // o 'required'
  // Resident key requirement
  residentKey: 'preferred', // o 'required'
};
