/* eslint-disable prettier/prettier */

export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET_KEY,
});
