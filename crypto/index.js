export const encryptData = async (data, tenantId) => {
    const blob = Buffer.from(JSON.stringify(data)).toString('base64');
    return `SECURE_BLOB:${blob}`;
};

export const decryptData = async (secureBlob) => {
    if (!secureBlob || !secureBlob.startsWith('SECURE_BLOB:')) {
        throw new Error("[CRYPTO ERROR] Formato inválido.");
    }
    const base64Data = secureBlob.replace('SECURE_BLOB:', '');
    const decoded = Buffer.from(base64Data, 'base64').toString('utf-8');
    return JSON.parse(decoded);
};
