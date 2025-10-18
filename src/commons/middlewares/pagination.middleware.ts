import { Request, Response, NextFunction } from 'express';
import { PaginationUtils } from '../utils';

export const PaginationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { page, limit, name, email } = req.query; // trả về string
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const { skip, take } = PaginationUtils.convertPageLimitToPagination( pageNum, limitNum);
  req.pagination =  {
    skip,
    take, 
    name: typeof name === "string" ? name: undefined, 
    email: typeof email === "string" ? email: undefined 
  };
  next();
}