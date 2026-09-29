import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function authenticate(req: Request, res: Response, next: NextFunction) {

  try {

    if (!req.session || !req.session.userId) {
      throw new AppError(401, "UNAUTHENTICATED", "User is not logged in")
    }
    
    next()
  } catch (err) {
    next(err)
  }

}

