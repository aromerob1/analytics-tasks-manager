import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err); // Log del error en la consola
    res.status(500).json({ message: err.message || "Internal Server Error" });
};