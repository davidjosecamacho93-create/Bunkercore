import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

/**
 * Inicia el proceso de registro de Passkey en el navegador
 * @param {object} registrationOptions - Opciones obtenidas del servidor
 * @returns {Promise<object>} Credencial de registro
 */
export async function initiatePasskeyRegistration(registrationOptions) {
  try {
    // Convierte el challenge y otras propiedades buffer a formato apropiado
    const attResp = await startRegistration(registrationOptions);
    return attResp;
  } catch (error) {
    console.error('Error en registro de Passkey:', error);
    throw error;
  }
}

/**
 * Inicia el proceso de autenticación con Passkey en el navegador
 * @param {object} authenticationOptions - Opciones obtenidas del servidor
 * @returns {Promise<object>} Respuesta de autenticación
 */
export async function initiatePasskeyAuthentication(authenticationOptions) {
  try {
    const assertResp = await startAuthentication(authenticationOptions);
    return assertResp;
  } catch (error) {
    console.error('Error en autenticación con Passkey:', error);
    throw error;
  }
}

/**
 * Verifica si el navegador soporta WebAuthn
 * @returns {boolean}
 */
export function isWebAuthnSupported() {
  return (
    window.PublicKeyCredential !== undefined &&
    navigator.credentials !== undefined
  );
}

/**
 * Verifica si el dispositivo soporta Passkeys (resident keys)
 * @returns {Promise<boolean>}
 */
export async function isPasskeySupported() {
  if (!isWebAuthnSupported()) {
    return false;
  }

  try {
    const isUserVerifyingPlatformAuthenticatorAvailable =
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return isUserVerifyingPlatformAuthenticatorAvailable;
  } catch (error) {
    console.error('Error verificando soporte de Passkeys:', error);
    return false;
  }
}

/**
 * Obtiene dispositivos de seguridad disponibles
 * @returns {Promise<Array>} Lista de dispositivos disponibles
 */
export async function getAvailableAuthenticators() {
  if (!isWebAuthnSupported()) {
    return [];
  }

  try {
    const credentials = await navigator.credentials.get({
      mediation: 'optional',
      publicKey: {
        challenge: new Uint8Array(32),
        rpId: 'localhost',
        userVerification: 'preferred',
      },
    });

    return credentials ? [credentials] : [];
  } catch (error) {
    console.warn('Error obteniendo autenticadores:', error);
    return [];
  }
}
