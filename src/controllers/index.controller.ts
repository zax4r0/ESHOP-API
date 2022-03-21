import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json('API RUNNING 🚀  | /api-docs to get the  swager 😎 🤟');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
