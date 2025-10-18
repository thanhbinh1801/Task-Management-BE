import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

class ZodValidationSchema {
  body? : ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  cookies?: ZodSchema;
}

export const ValidateMiddleware = (zodSchema: ZodValidationSchema) => {
  return ( req: Request, res: Response, next: NextFunction) => {
    try{
     for ( const key in zodSchema){
      const schema = zodSchema[key as keyof ZodValidationSchema]
      schema?.parse(req[key as keyof Request])
     }
      next();
    }
    catch(err) {
      if( err instanceof ZodError) {
        res.status(400)
      }
    }

  }
}