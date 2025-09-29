export type AppJwtPayload = {
  userId: string;
  email: string;
  exp?: number;
};