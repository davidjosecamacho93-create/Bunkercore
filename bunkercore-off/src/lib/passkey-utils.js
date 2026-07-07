import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { PASSKEY_CONFIG, SECURITY_CONFIG } from './passkey-config';

/**
 * Genera opciones para el registro de un nuevo Passkey
 * @param {string} userId - ID único del usuario
 * @param {string} userName - Nombre de usuario
 * @param {string} userDisplayName - Nombre para mostrar
 * @param {Array} existingCredentialIds - IDs de credenciales existentes
 * @returns {Promise<object>} Opciones de registro
 */
export async function generatePasskeyRegistrationOptions(
  userId,
  userName,
  userDisplayName,
  existingCredentialIds = []
) {
  try {
    const options = await generateRegistrationOptions({
      rpName: PASSKEY_CONFIG.rpName,
      rpID: PASSKEY_CONFIG.rpId,
      userID: userId,
      userName: userName,
      userDisplayName: userDisplayName,
      timeout: PASSKEY_CONFIG.timeout,
      attestationType: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // o 'cross-platform'
        residentKey: SECURITY_CONFIG.residentKey,
        userVerification: SECURITY_CONFIG.userVerification,
      },
      supportedAlgorithmIDs: SECURITY_CONFIG.supportedAlgorithmIDs,
      excludeCredentials: existingCredentialIds.map(id => ({
        id: id,
        type: 'public-key',
        transports: ['internal', 'usb', 'nfc', 'ble'],
      })),
    });

    return options;
  } catch (error) {
    console.error('Error generando opciones de registro:', error);
    throw error;
  }
}

/**
 * Verifica la respuesta de registro de un Passkey
 * @param {string} credentialJSON - Credencial en formato JSON del cliente
 * @param {object} expectedChallenge - Challenge esperado
 * @returns {Promise<object>} Verificación y datos del credential
 */
export async function verifyPasskeyRegistration(credentialJSON, expectedChallenge) {
  try {
    const credential = typeof credentialJSON === 'string' 
      ? JSON.parse(credentialJSON) 
      : credentialJSON;

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: expectedChallenge,
      expectedOrigin: PASSKEY_CONFIG.origin,
      expectedRPID: PASSKEY_CONFIG.rpId,
    });

    if (verification.verified) {
      return {
        success: true,
        credentialId: Buffer.from(
          verification.registrationInfo.credentialID
        ).toString('base64'),
        publicKey: Buffer.from(
          verification.registrationInfo.credentialPublicKey
        ).toString('base64'),
        counter: verification.registrationInfo.counter,
        credentialDeviceType: verification.registrationInfo.credentialDeviceType,
        credentialBackedUp: verification.registrationInfo.credentialBackedUp,
      };
    }

    return {
      success: false,
      error: 'La verificación del Passkey falló',
    };
  } catch (error) {
    console.error('Error verificando registro de Passkey:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Genera opciones para la autenticación con Passkey
 * @param {Array} userCredentials - Credenciales del usuario
 * @returns {Promise<object>} Opciones de autenticación
 */
export async function generatePasskeyAuthenticationOptions(userCredentials = []) {
  try {
    const options = await generateAuthenticationOptions({
      timeout: PASSKEY_CONFIG.timeout,
      userVerification: SECURITY_CONFIG.userVerification,
      allowCredentials: userCredentials.map(cred => ({
        id: Buffer.from(cred.credentialId, 'base64'),
        type: 'public-key',
        transports: ['internal', 'usb', 'nfc', 'ble'],
      })),
    });

    return options;
  } catch (error) {
    console.error('Error generando opciones de autenticación:', error);
    throw error;
  }
}

/**
 * Verifica la respuesta de autenticación de un Passkey
 * @param {string} credentialJSON - Credencial en formato JSON del cliente
 * @param {object} expectedChallenge - Challenge esperado
 * @param {string} storedPublicKey - Clave pública almacenada (en base64)
 * @param {number} storedCounter - Counter almacenado previamente
 * @returns {Promise<object>} Verificación y nuevo counter
 */
export async function verifyPasskeyAuthentication(
  credentialJSON,
  expectedChallenge,
  storedPublicKey,
  storedCounter
) {
  try {
    const credential = typeof credentialJSON === 'string' 
      ? JSON.parse(credentialJSON) 
      : credentialJSON;

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: expectedChallenge,
      expectedOrigin: PASSKEY_CONFIG.origin,
      expectedRPID: PASSKEY_CONFIG.rpId,
      credential: {
        id: Buffer.from(credential.id, 'base64'),
        publicKey: Buffer.from(storedPublicKey, 'base64'),
        counter: storedCounter,
      },
    });

    if (verification.verified) {
      return {
        success: true,
        newCounter: verification.authenticationInfo.newCounter,
      };
    }

    return {
      success: false,
      error: 'La autenticación con Passkey falló',
    };
  } catch (error) {
    console.error('Error verificando autenticación de Passkey:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
