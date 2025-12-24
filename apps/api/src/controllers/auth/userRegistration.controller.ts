import { Request, Response } from "express";
import { logger } from "@/lib/winston";
import argon2 from "argon2";
import { userRegistration } from "@shared/validations";
import { respond } from "@/utils/respond";
import userModel from "@/models/user.model";

export const CreateUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as userRegistration;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) {
      logger.warn("User already exists with email:", email);
      return respond(res, "CONFLICT", "User already exists with this email", {
        errors: {
          "body.email": "Email is already in use",
        },
      });
    }

    const hashedPassword = await argon2.hash(password);

    await new userModel({
      email: email,
      password: hashedPassword,
      role: "user",
      name: name,
    }).save();

    logger.info("User Created with email:", email);

    return respond(res, "SUCCESS", "User created successfully", {
      data: { email: req.body.email, name: req.body.name },
    });
  } catch (error) {
    logger.error("Create user error:", error);
  }
};
