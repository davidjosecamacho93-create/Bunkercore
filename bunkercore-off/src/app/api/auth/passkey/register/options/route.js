import { generatePasskeyRegistrationOptions } from '@/lib/passkey-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return Response.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Buscar o crear usuario
    let user = await prisma.user.findUnique({
      where: { email },
      include: { credentials: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
        include: { credentials: true },
      });
    }

    // Obtener IDs de credenciales existentes
    const existingCredentialIds = user.credentials.map(cred => 
      Buffer.from(cred.credentialId, 'base64')
    );

    // Generar opciones de registro
    const registrationOptions = await generatePasskeyRegistrationOptions(
      user.id,
      email,
      name,
      existingCredentialIds
    );

    // Guardar challenge en base de datos para verificación posterior
    const challenge = await prisma.authenticationChallenge.create({
      data: {
        challenge: Buffer.from(registrationOptions.challenge, 'base64').toString('hex'),
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      },
    });

    // Retornar opciones al cliente
    return Response.json(
      {
        options: registrationOptions,
        challengeId: challenge.id,
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en registro de opciones:', error);
    return Response.json(
      { error: error.message || 'Error generando opciones de registro' },
      { status: 500 }
    );
  }
}
