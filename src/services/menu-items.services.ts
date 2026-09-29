import { AppError } from "../utils/AppError";
import db from "../db/pool"
import { menuItemTypes } from "../schemas/menu-items.schema";

export async function getAll(inputData: menuItemTypes["getAllInput"]) {
    const result: menuItemTypes["itemResponsesSchema"] = (await db.query(`SELECT menu_items.menu_id, menu_items.id, menu_items.name, menu_items.description, menu_items.price, sectiones.item_sections FROM menu_items LEFT JOIN (SELECT item_sections.menu_item_id, ARRAY_AGG(json_build_object('id', item_sections.id, 'name', item_sections.name, 'required', item_sections.required, 'multiple', item_sections.multiple, 'item_options', item_options)) as item_sections FROM (SELECT menu_item_sections.menu_item_id, menu_item_sections.id, menu_item_sections.name, menu_item_sections.required, menu_item_sections.multiple, item_options FROM menu_item_sections LEFT JOIN (SELECT menu_item_options.menu_item_section_id, ARRAY_AGG(json_build_object('id', menu_item_options.id, 'name', menu_item_options.name, 'price', menu_item_options.price)) as item_options FROM menu_item_options GROUP BY menu_item_options.menu_item_section_id) AS item_options ON item_options.menu_item_section_id = menu_item_sections.id) as item_sections GROUP BY item_sections.menu_item_id) AS sectiones ON sectiones.menu_item_id = menu_items.id WHERE menu_id = '${inputData.menu_section_id}';`)).rows;
    return result
}

export async function post(inputData: menuItemTypes["createInput"]) {
    if (!inputData.price.toString().includes(".")) {
        await db.query(`INSERT INTO menu_items (menu_id, name, description, price, restaurant_id) VALUES ('${inputData.menu_section_id}', '${inputData.name}', '${inputData.description}', '${inputData.price}', '${inputData.restaurant_id}');`);
    } else if (inputData.price.toString().split(".")[1].length > 2) {
        throw new AppError(400, "INVALID_PRICE", "Price must have no more than 2 decimal places.")
    } else {
        await db.query(`INSERT INTO menu_items (menu_id, name, description, price, restaurant_id) VALUES ('${inputData.menu_section_id}', '${inputData.name}', '${inputData.description}', '${inputData.price}', '${inputData.restaurant_id}');`);
    }
}

export async function get(inputData: menuItemTypes["getInput"]) {
    const result: menuItemTypes["itemResponseSchema"] = (await db.query(
        `SELECT * FROM menu_items WHERE id = '${inputData.menu_item_id}';`
    )).rows;
    return result
}

export async function put(inputData: menuItemTypes["updateInput"]) {
    if (!inputData.price.toString().includes(".")) {
    await db.query(
        `UPDATE menu_items set name = '${inputData.name}', description = '${inputData.description}', price = '${inputData.price}' WHERE id = '${inputData.menu_item_id}' AND restaurant_id = '${inputData.restaurant_id}';`
    );
    } else if (inputData.price.toString().split(".")[1].length > 2) {
        throw new AppError(400, "INVALID_PRICE", "Price must have no more than 2 decimal places.")
    } else {
        await db.query(
            `UPDATE menu_items set name = '${name}', description = '${inputData.description}', price = '${inputData.price}' WHERE id = '${inputData.menu_item_id}';`
        );
    }
}

export async function deleteS(inputData: menuItemTypes["getInput"]) {
    await db.query(`DELETE FROM menu_items WHERE id = '${inputData.menu_item_id}';`);
}

export const menuItemsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}
