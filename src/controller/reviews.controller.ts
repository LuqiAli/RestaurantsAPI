import { NextFunction, Request, Response } from "express"
import { reviewsService } from "../services/reviews.services";
import { reviewsType } from "../schemas/reviews.schema";

export async function getReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await reviewsService.getAll()

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
  }
}

export async function postReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurant_id, rating, review } = req.body as reviewsType["createBodyInput"];
        const user_id: reviewsType["userId"] = req.session.userId

        await reviewsService.post({restaurant_id, rating, review, user_id})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { review_id } = req.params as reviewsType["paramInput"]

        const result = await reviewsService.get({review_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { review_id } = req.params as reviewsType["paramInput"]
        const { rating, review } = req.body as reviewsType["updateBodyInput"];

        await reviewsService.put({review_id, rating, review})
        
        res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { review_id } = req.params as reviewsType["paramInput"]

        await reviewsService.deleteS({review_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}