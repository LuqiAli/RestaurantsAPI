import db from "../db/pool"
import { AppError } from "../utils/AppError";
import { menuItemOptionsTypes } from "../schemas/menu-item-options.schema";

export async function getAll(inputData: menuItemOptionsTypes["getAllInput"]) {
    const result: menuItemOptionsTypes["menuItemOptionsResponse"] = (await db.query(`SELECT id, restaurant_id, menu_section_id, name, price FROM menu_item_options WHERE restaurant_id = '${inputData.restaurant_id}' AND menu_item_section_id = '${inputData.menu_item_section_id}';`)).rows;
    return result
}

export async function post(inputData: menuItemOptionsTypes["createInput"]) {
    if (inputData.price.toString().includes(".") && inputData.price.toString().split(".")[1].length > 2) {
        throw new AppError(400, "INVALID_PRICE", "Price must have no more than 2 decimal places.")
    } else {
        await db.query(
            `INSERT INTO menu_item_options (menu_item_section_id, name, price, restaurant_id) VALUES ('${inputData.menu_item_section_id}', '${inputData.name}', '${inputData.price}', '${inputData.restaurant_id}');`
        );
    }
}

export async function get(inputData: menuItemOptionsTypes["getInput"]) {
    const result: menuItemOptionsTypes["menuItemOptionResponse"] = (await db.query(
        `SELECT id, restaurant_id, menu_section_id, name, price FROM menu_item_options WHERE id = '${inputData.menu_item_option_id}' AND restaurant_id = '${inputData.restaurant_id}';`
    )).rows;
    return result
}

export async function put(inputData: menuItemOptionsTypes["updateInput"]) {
    if (!inputData.price.toString().includes(".")) {
        await db.query(
            `UPDATE menu_item_options set name = '${name}', price = '${inputData.price}' WHERE id = '${inputData.menu_item_option_id}';`
        );
    } else if (inputData.price.toString().split(".")[1].length > 2) {
        throw new AppError(400, "INVALID_PRICE", "Price must have no more than 2 decimal places.")
    } else {
        await db.query(
            `UPDATE menu_item_options set name = '${name}', price = '${inputData.price}' WHERE id = '${inputData.menu_item_option_id}';`
        );
    }
}

export async function deleteS(menu_item_option_id: menuItemOptionsTypes["menu_item_option_idSchema"]) {
    await db.query(`DELETE FROM menu_item_options WHERE id = '${menu_item_option_id}';`);
}

export const menuItemOptionsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}