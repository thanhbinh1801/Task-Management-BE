export { }

declare global {
  namespace Express {
    interface Request {
      pagination?: {
        skip: number;
        take: number;
        name?: string;
        email?: string;
      },
      users?: {
        userId: string;
        email: string;
        exp?: string;
      }
    }
  }
}