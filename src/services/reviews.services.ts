import db from "../db/pool"
import { AppError } from "../utils/AppError";
import { reviewsType } from "../schemas/reviews.schema";

export async function getAll() {
    const result: reviewsType["reviewsResponse"] = (await db.query(`SELECT * FROM reviews;`)).rows;
    return result
}

export async function post(inputData: reviewsType["createInput"]) {
    if (inputData.rating < 0 || inputData.rating > 5) {
        throw new AppError(400, "INVALID_RATING", "Rating must be between 0-5.")
    }
    
    await db.query(
        `INSERT INTO reviews (restaurant_id, user_id, rating, review) VALUES ('${inputData.restaurant_id}', '${inputData.user_id}', '${inputData.rating}', '${inputData.review}');`
    );
}

export async function get(inputData: reviewsType["paramInput"]) {
    const result: reviewsType["reviewResponse"] = (await db.query(
        `SELECT * FROM reviews WHERE id = '${inputData.review_id}';`
    )).rows;
    return result
}

export async function put(inputData: reviewsType["updateInput"]) {
    if (inputData.rating < 0 || inputData.rating > 5) {
        throw new AppError(400, "INVALID_RATING", "Rating must be between 0-5.")
    } 
    await db.query(
        `UPDATE reviews set rating = '${inputData.rating}', review = '${inputData.review}' WHERE id = '${inputData.review_id}';`
    );
}

export async function deleteS(inputData: reviewsType["paramInput"]) {
    await db.query(`DELETE FROM reviews WHERE id = '${inputData.review_id}';`);
}

export const reviewsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}