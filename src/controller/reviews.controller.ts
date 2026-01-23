import { Request, Response } from "express"
import { ReviewsInterface, ReviewsInterfaceBody } from "../type/reviews";
import db from "../config/db"

export async function getReviews(req: Request, res: Response) {
    try {
        const result: ReviewsInterface[] = (await db.query(`SELECT * FROM reviews;`)).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
}

export async function postReview(req: Request, res: Response) {
    try {
        const { restaurant_id, user_id, rating, review } = req.body as ReviewsInterfaceBody;

        if (rating < 0 || rating > 5) {
            res.status(400).json({ status: "failiure", data: "Rating must be between 0 & 5" })
        } else {    
            await db.query(
                `INSERT INTO reviews (restaurant_id, user_id, rating, review) VALUES ('${restaurant_id}', '${user_id}', '${rating}', '${review}');`
            );
            res.status(201).json({ status: "success" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getReview(req: Request, res: Response) {
    try {
        const { review_id } = req.params;

        const result: ReviewsInterface = (await db.query(
            `SELECT * FROM reviews WHERE id = '${review_id}';`
        )).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putReview(req: Request, res: Response) {
    try {
        const { review_id } = req.params;
        const { rating, review } = req.body as ReviewsInterfaceBody;

        if (rating < 0 || rating > 5) {
            res.status(400).json({ status: "failiure", data: "Rating must be between 0 & 5" }).end()
        } else {
            await db.query(
                `UPDATE reviews set rating = '${rating}', review = '${review}' WHERE id = '${review_id}';`
            );
            res.status(200).json({ status: "success" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteReview(req: Request, res: Response) {
    try {
        const { review_id } = req.params;

        await db.query(`DELETE FROM reviews WHERE id = '${review_id}';`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}