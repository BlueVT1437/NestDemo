import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  console.log('Request to', req.method, 'from', req.originalUrl);
  next();
};
