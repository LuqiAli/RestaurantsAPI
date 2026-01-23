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
        let query: string;

        if (body.type === "restaurant") {
            query = `INSERT INTO addresses (restaurant_id, is_restaurant, address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.link_id}', True, '${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}');`;
        } else {
            query = `INSERT INTO addresses (user_id, is_restaurant, address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.link_id}', False, '${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}');`;
        }

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