import { Request, Response } from "express"
import { AddressInterface, AddressInterfaceBody } from "../type/addresses";
import db from "../config/db"

export async function getAddresses(req: Request, res: Response) {
    try {
        const result: AddressInterface[] = (await db.query("SELECT * FROM addresses;")).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postAddress(req: Request, res: Response) {
    try {
        const body: AddressInterfaceBody  = req.body;
        let query: string = `WITH addIns AS (INSERT INTO addresses (address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}') RETURNING id as address_id)`;

        
        if (body.type === "user" && (!body.user_address_type || !body.is_primary)) {
            res.status(400).json({ status: "failure", data: "Enter values in [user_address_type] & [is_primary] fields" })
            throw new Error('If address type is user, user_address_type and is_primary must be filled')
        } else if (body.type === "user") {
            query += `INSERT INTO user_addresses (user_id, address_id, type, is_primary) VALUES ('${body.link_id}', (SELECT address_id FROM addIns), '${body.user_address_type}', ${body.is_primary});`
        } else {
            query += `INSERT INTO restaurant_addresses (restaurant_id, address_id) VALUES ('${body.link_id}', (SELECT address_id FROM addIns));`
        }

        console.log(query)

        await db.query(query);

        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getAddress(req: Request, res: Response) {
    try {
        const { address_id } = req.params;

        console.log(address_id)  

        const result: AddressInterface = (await db.query(`SELECT * FROM addresses WHERE id = '${address_id}'`)).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }  
}

export async function putAddress(req: Request, res: Response) {
    try {
        const { address_id } = req.params;
        const { address_1, address_2, address_3, city, town, postcode, country } =
        req.body as AddressInterfaceBody;

        await db.query(
            `UPDATE addresses set address_1 = '${address_1}', address_2 = '${address_2}', address_3 = '${address_3}', city = '${city}', town = '${town}', postcode = '${postcode}', country = '${country}' WHERE id = '${address_id}';`
        );

        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteAddress(req: Request, res: Response) {
    try {
        const { address_id } = req.params;

        await db.query(`DELETE FROM addresses WHERE id = '${address_id}';`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}