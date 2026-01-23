import { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    res.status(401).json({ status: "failure", data: "Unauthorized"})
    const err = new Error("Unauthorized")
    next(err)
  }
  next()
}

