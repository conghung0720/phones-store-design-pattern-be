import { Next } from '@nestjs/common';

const jwt = require('jsonwebtoken');

export const keyTokenPairs = async (payload, publicKey, privateKey) => {
  const accessToken = await jwt.sign(payload, privateKey, {
    expiresIn: '7 days',
  });

  const refreshToken = await jwt.sign(payload, publicKey, {
    expiresIn: '10 days',
  });



  return { accessToken, refreshToken };
};
