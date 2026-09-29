import db from "../db/pool"
import { menuSectionTypes } from "../schemas/menu-sections.schema";

export async function getAll(inputData: menuSectionTypes["getAllInput"]) {
    const result: menuSectionTypes["itemSectionResponses"] = (await db.query(`SELECT menu_sections.restaurant_id, menu_sections.id, menu_sections.name, itemes.items FROM menu_sections LEFT JOIN (SELECT items.menu_id, ARRAY_AGG(json_build_object('id', items.id, 'name', items.name, 'description', items.description, 'price', items.price, 'item_sections', item_sections)) AS items FROM (SELECT menu_items.menu_id, menu_items.id, menu_items.name, menu_items.description, menu_items.price, sectiones.item_sections FROM menu_items LEFT JOIN (SELECT item_sections.menu_item_id, ARRAY_AGG(json_build_object('id', item_sections.id, 'name', item_sections.name, 'required', item_sections.required, 'multiple', item_sections.multiple, 'item_options', item_options)) AS item_sections FROM (SELECT menu_item_sections.menu_item_id, menu_item_sections.id, menu_item_sections.name, menu_item_sections.required, menu_item_sections.multiple, item_options FROM menu_item_sections LEFT JOIN (SELECT menu_item_options.menu_item_section_id, ARRAY_AGG(json_build_object('id', menu_item_options.id, 'name', menu_item_options.name, 'price', menu_item_options.price)) AS item_options FROM menu_item_options GROUP BY menu_item_options.menu_item_section_id) AS item_options ON item_options.menu_item_section_id = menu_item_sections.id) AS item_sections GROUP BY item_sections.menu_item_id) AS sectiones ON sectiones.menu_item_id = menu_items.id) AS items GROUP BY items.menu_id) AS itemes ON itemes.menu_id = menu_sections.id WHERE restaurant_id = '${inputData.restaurant_id}';`)).rows;
    return result
}

export async function post(inputData: menuSectionTypes["createInput"]) {
    await db.query(
        `INSERT INTO menu_sections (restaurant_id, name) VALUES ('${inputData.restaurant_id}', '${inputData.name}');`
    );
}

export async function get(inputData: menuSectionTypes["getInput"]) {
    const result: menuSectionTypes["itemSectionResponse"] = (await db.query(
        `SELECT * FROM menu_sections WHERE id = '${inputData.menu_section_id}' AND restaurant_id = '${inputData.restaurant_id}';`
    )).rows;
    return result
}

export async function put(inputData: menuSectionTypes["updateInput"]) {
    await db.query(
        `UPDATE menu_sections set name = '${inputData.name}' WHERE id = '${inputData.menu_section_id}';`
    );
}

export async function deleteS(inputData: menuSectionTypes["paramInput"]) {
    await db.query(
        `DELETE FROM menu_sections WHERE id = '${inputData.menu_section_id}';`
    );
}

export const menuSectionsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}