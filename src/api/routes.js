import express from 'express';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

dotenv.config();
const app = express();
app.use(express.json());

const sql = postgres(process.env.DATABASE_URL);

// Identidad del Sistema
const rpName = 'Bunkercore';
const rpID = 'api.davidauthn.online';

app.get('/', (req, res) => res.send('Bunkercore: sistema iniciado en modo Zero trust'));

// 1. Iniciar registro de llave FIDO2
app.post('/register/options', async (req, res) => {
  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: 'admin-david',
    userName: 'david@bunkercore',
  });
  res.json(options);
});

// 2. Finalizar y guardar en Neon
app.post('/register/verify', async (req, res) => {
  const { body } = req;
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: body.challenge,
    expectedOrigin: `https://${rpID}`,
    expectedRPID: rpID,
  });

  if (verification.verified) {
    const { registrationInfo } = verification;
    await sql`
      INSERT INTO credentials (id, public_key, counter)
      VALUES (${registrationInfo.credentialID}, ${registrationInfo.credentialPublicKey}, ${registrationInfo.counter})
    `;
    res.json({ verified: true });
  } else {
    res.status(400).send('Registro fallido');
  }
});

app.listen(3000, () => console.log('Bunkercore activo en puerto 3000'));
