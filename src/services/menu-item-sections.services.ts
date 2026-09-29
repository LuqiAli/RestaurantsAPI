import db from "../db/pool"
import { menuItemSectionsTypes } from "../schemas/menu-item-sections.schema";

export async function getAll(inputData: menuItemSectionsTypes["menu_item_idInputSchema"]) {

    const result: menuItemSectionsTypes["menuItemSectionsResponses"] = (await db.query(`SELECT menu_item_sections.menu_item_id, menu_item_sections.id, menu_item_sections.name, menu_item_sections.required, menu_item_sections.multiple, item_options FROM menu_item_sections LEFT JOIN (SELECT menu_item_options.menu_item_section_id, ARRAY_AGG(json_build_object('id', menu_item_options.id, 'name', menu_item_options.name, 'price', menu_item_options.price)) as item_options FROM menu_item_options GROUP BY menu_item_options.menu_item_section_id) AS item_options ON item_options.menu_item_section_id = menu_item_sections.id WHERE menu_item_id = '${inputData.menu_item_id}';`)).rows;
    
    return result
} 

export async function post(data: menuItemSectionsTypes["createInputSchema"]) {

    await db.query(
        `INSERT INTO menu_item_sections (restaurant_id, menu_item_id, name, required, multiple) VALUES ('${data.restaurant_id}', '${data.menu_item_id}', '${data.name}', '${data.required}', '${data.multiple}');`
    );
}

export async function get(data: menuItemSectionsTypes["paramsInputSchema"]) {

    const result: menuItemSectionsTypes["menuItemSectionsResponse"] = (await db.query(
        `SELECT * FROM menu_item_sections WHERE id = '${data.menu_item_section_id}' AND restaurant_id = '${data.restaurant_id}' AND menu_item_id = '${data.menu_item_id}';`
    )).rows;

    return result
}

export async function put(data: menuItemSectionsTypes["updateInputSchema"]) {
    await db.query(
        `UPDATE menu_item_sections set name = '${data.name}', required = '${data.required}', multiple = '${data.multiple}' WHERE id = '${data.menu_item_section_id}';`
    );
}

export async function deleteS(inputData: menuItemSectionsTypes["menu_item_section_idInputSchema"]) {
    await db.query(
        `DELETE FROM menu_item_sections WHERE id = '${inputData.menu_item_section_id}';`
    );
}

export const menuItemSectionService = {
    getAll,
    post,
    get,
    put,
    deleteS
}