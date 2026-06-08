// bunkercore/crypto.js
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recomendado para GCM
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Cifra datos antes de enviarlos a Neon (Base de datos)
 * @param {string} text - El dato sensible en texto claro
 * @param {string} secretKey - Llave maestra (debe ser de 32 bytes)
 */
export const encrypt = (text, secretKey) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Formato de salida: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

/**
 * Descifra datos recuperados de Neon
 */
export const decrypt = (encryptedData, secretKey) => {
    const [ivHex, tagHex, encrypted] = encryptedData.split(':');
    
    const decipher = crypto.createDecipheriv(
        ALGORITHM, 
        Buffer.from(secretKey, 'hex'), 
        Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};
