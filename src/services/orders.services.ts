import db from "../db/pool"
import { AppError } from "../utils/AppError";
import { menuItemOptionsTypes } from "../schemas/menu-item-options.schema";
import { menuItemTypes } from "../schemas/menu-items.schema";
import { ordersTypes } from "../schemas/orders.schema";


export async function getAll() {
    const result: ordersTypes["ordersResponse"] = (await db.query("SELECT orders.id, orders.restaurant_id, orders.name, orders.phone, orders.user_id, orders.is_delivery, orders.status, orders.total_amount, order_items, addressT.address FROM orders LEFT JOIN (SELECT order_items.order_id, ARRAY_AGG(json_build_object('order_item_id', order_items.id, 'item_id', order_items.item_id, 'name', order_items.item_name, 'quantity', order_items.quantity, 'item_price', order_items.item_price, 'item_options', item_options)) AS order_items FROM order_items LEFT JOIN (SELECT order_item_options.order_item_id, order_item_options.order_id, ARRAY_AGG(json_build_object('order_item_option_id', order_item_options.id, 'menu_option_id', order_item_options.item_option_id, 'name', order_item_options.item_option_name, 'price', order_item_options.item_option_price)) as item_options FROM order_item_options GROUP BY order_item_options.order_item_id, order_item_options.order_id) as item_options ON item_options.order_id = order_items.order_id AND item_options.order_item_id = order_items.id GROUP BY order_items.order_id) as order_items ON order_items.order_id = orders.id LEFT JOIN (SELECT order_addresses.order_id, ARRAY_AGG(json_build_object('address_1', order_addresses.address_1, 'address_2', order_addresses.address_2, 'address_3', order_addresses.address_3, 'city', order_addresses.city, 'town', order_addresses.town, 'postcode', order_addresses.postcode, 'country', order_addresses.country)) AS address FROM order_addresses GROUP BY order_addresses.order_id) as addressT ON addressT.order_id = orders.id;")).rows;
    return result
}

export async function post(inputData: ordersTypes["createInput"]) {
    await inputData.client.query("BEGIN;")
    const menuItems = (await inputData.client.query(`SELECT id, name, price FROM menu_items WHERE restaurant_id = '${inputData.restaurant_id}';`)).rows
    const menuOptions = (await inputData.client.query(`SELECT id, name, price FROM menu_item_options WHERE restaurant_id = '${inputData.restaurant_id}';`)).rows

    let subTotal: number = 0
    
    const itemMap = new Map(
        menuItems.map((item: any) => {return [item.id, item]})
    )
    const itemOptionMap = new Map(
        menuOptions.map((item: any) => {return [item.id, item]})
    )

    const orderId = (await inputData.client.query(`INSERT INTO orders (restaurant_id, user_id, is_delivery, total_amount, name, phone) VALUES ('${inputData.restaurant_id}', '${inputData.user_id}', ${inputData.is_delivery}, ${subTotal}, (SELECT users.name FROM users WHERE id = '${inputData.user_id}'), (SELECT users.phone FROM users WHERE id = '${inputData.user_id}')) returning id;`)).rows[0].id
    
    console.log(orderId)
    
    for (let i = 0; i < inputData.items.length; i++) {
        const possibleItem = itemMap.get(inputData.items[i].id)
        !possibleItem ? new AppError(400, "INVALID_ITEM", "Item doesn't exist") : ""
        const foundItem = possibleItem as menuItemTypes["itemResponseSchema"]

        subTotal += Number(foundItem.price * inputData.items[i].quantity)

        const orderItemId = (await inputData.client.query(`INSERT INTO order_items (order_id, item_id, quantity, item_price, item_name) VALUES ('${orderId}', '${foundItem.id}', '${inputData.items[i].quantity}', ${foundItem.price}, '${foundItem.name}') returning id;`)).rows[0].id

        for (let j = 0; j < inputData.items[i].item_options.length; j++) {
            const possibleOption = itemOptionMap.get(inputData.items[i].item_options[j].id)
            !possibleOption ? new AppError(400, "INVALID_ITEM_OPTION", "Item option doesn't exists") : ""
            const foundOption = possibleOption as menuItemOptionsTypes["menuItemOptionResponse"]

            subTotal += Number(foundOption.price * inputData.items[i].quantity)

            await inputData.client.query(`INSERT INTO order_item_options (order_id, item_option_id, item_option_name, item_option_price, order_item_id) VALUES ('${orderId}', '${foundOption.id}', '${foundOption.name}', ${foundOption.price}, '${orderItemId}');`)
        }

    }

    const total = Math.floor((subTotal*100))/100
    
    await inputData.client.query(`UPDATE orders set total_amount = ${total} WHERE id = '${orderId}';`)

    if (inputData.is_delivery) {
        const address = (await inputData.client.query(`SELECT * FROM addresses WHERE id = (SELECT address_id FROM user_addresses WHERE user_id = '${inputData.user_id}');`)).rows[0]
        console.log(address)
        await inputData.client.query(`INSERT INTO order_addresses(order_id, address_1, address_2, address_3, city, town, postcode, country) VALUES ('${orderId}', '${address.address_1}', '${address.address_2}', '${address.address_3}', '${address.city}', '${address.town}', '${address.postcode}', '${address.country}');`)
    }

    await inputData.client.query(`COMMIT;`)
}

export async function get(inputData: ordersTypes["order_idInput"]) {
    const result: ordersTypes["orderResponse"] = (await db.query(
        `SELECT orders.id, orders.restaurant_id, orders.name, orders.phone, orders.user_id, orders.is_delivery, orders.status, orders.total_amount, order_items FROM orders LEFT JOIN (SELECT order_items.order_id, ARRAY_AGG(json_build_object('order_item_id', order_items.id, 'item_id', order_items.item_id, 'name', order_items.item_name, 'quantity', order_items.quantity, 'item_price', order_items.item_price, 'item_options', item_options)) AS order_items FROM order_items LEFT JOIN (SELECT order_item_options.order_item_id, order_item_options.order_id, ARRAY_AGG(json_build_object('order_item_option_id', order_item_options.id, 'menu_option_id', order_item_options.item_option_id, 'name', order_item_options.item_option_name, 'price', order_item_options.item_option_price)) as item_options FROM order_item_options GROUP BY order_item_options.order_item_id, order_item_options.order_id) as item_options ON item_options.order_id = order_items.order_id AND item_options.order_item_id = order_items.id GROUP BY order_items.order_id) as order_items ON order_items.order_id = orders.id WHERE id = '${inputData.order_id}';`
    )).rows;
    return result
}

export async function put(inputData: ordersTypes["updateInput"]) {
    await db.query(
        `UPDATE orders set status = '${inputData.status}' WHERE id = '${inputData.order_id}';`
    );
}

export async function deleteS(inputData: ordersTypes["order_idInput"]) {
    await db.query(`DELETE FROM orders WHERE id = '${inputData.order_id}';`);
}

export const ordersService = {
    getAll,
    post,
    get,
    put,
    deleteS
}