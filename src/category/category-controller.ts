import type { Request, Response } from 'express';
export class CategoeryController {
  create(req: Request, res: Response) {
    res.json({ data: 'heelo' });
  }
}
