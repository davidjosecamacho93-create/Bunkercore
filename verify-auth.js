import { verifyAuthenticationResponse } from '@simplewebauthn/server';

export async function verifyAuth(body, expectedChallenge, authenticator) {
    console.log("[DEBUG] Iniciando verificación estricta...");
    console.log("[DEBUG] Challenge esperado:", expectedChallenge);
    
    try {
        const verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: expectedChallenge,
            expectedOrigin: 'https://tu-dominio.com', // Ajusta a tu origen real
            expectedRPID: 'tu-dominio.com',
            authenticator: {
                credentialPublicKey: Buffer.from(authenticator.publicKey, 'base64'),
                credentialID: authenticator.credentialID,
                counter: authenticator.counter,
            },
        });

        console.log("[DEBUG] Resultado de librería:", JSON.stringify(verification, null, 2));

        if (verification.verified) {
            console.log("[SUCCESS] Firma validada criptográficamente.");
            return { verified: true, info: verification.authenticationInfo };
        } else {
            console.error("[FAIL] La firma no pudo ser validada.");
            return { verified: false };
        }
    } catch (err) {
        console.error("[CRITICAL] Error durante la verificación:", err.message);
        throw err;
    }
}
