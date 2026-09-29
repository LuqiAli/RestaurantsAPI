import db from "../db/pool"
import { tagsTypes } from "../schemas/tags.schema"

export async function getAll() {
    const result: tagsTypes["tagsResponseSchema"] = (await db.query("SELECT * FROM tags;")).rows
    return result
}

export async function post(inputData: tagsTypes["createInput"]) {
    await db.query(`INSERT INTO (title, type) VALUES ('${inputData.title}', '${inputData.type}');`)
}

export async function get(inputData: tagsTypes["paramInput"]) {
    const result: tagsTypes["tagResponseSchema"] = (await db.query(`SELECT * FROM tags WHERE id = '${inputData.tag_id}';`)).rows
    return result
}

export async function put(inputData: tagsTypes["updateInput"]) {
    await db.query(
        `UPDATE tags set title = '${inputData.title}', type = '${inputData.type}' WHERE id = '${inputData.tag_id}';`
    );
}

export async function deleteS(inputData: tagsTypes["paramInput"]) {
    await db.query(`DELETE FROM tags WHERE id = '${inputData.tag_id}'`);
}

export const tagsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}