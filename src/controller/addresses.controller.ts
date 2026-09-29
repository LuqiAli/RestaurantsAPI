import { NextFunction, Request, Response } from "express"
import { addressesService } from "../services/addresses.services";
import { addressTypes } from "../schemas/addresses.schema";

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await addressesService.getAll()
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const body: addressTypes["create"]  = req.body;
        
        await addressesService.post(body)

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const address_id = req.params.address_id.toString();

        const result = await addressesService.get(address_id)
        
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }  
}

export async function putAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const address_id = req.params.address_id.toString();
        const { address_1, address_2, address_3, city, town, postcode, country } = req.body as addressTypes["update"];
        
        const inputData: addressTypes["update"] = {address_id, address_1, address_2, address_3, city, town, postcode, country}

        await addressesService.put(inputData)

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const address_id: string = req.params.address_id.toString();

        await addressesService.deleteS(address_id)
        
        res.status(204).end();
    } catch (err) {
        next(err)
    }
}