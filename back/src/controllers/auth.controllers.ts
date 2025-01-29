import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/async.handler";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  res.status(201).json(user);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await loginUser(req.body.email, req.body.password);
  res.status(200).json(user);
});