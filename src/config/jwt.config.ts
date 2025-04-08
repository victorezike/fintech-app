import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => ({
    secret: process.env.JWT_SECRET || 'secretKey',
    signOptions: { expiresIn: '60m' },
  }),
};
