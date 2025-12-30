import { Request, Response } from "express";
import argon2 from "argon2";
import { respond } from "@/utils/respond";
import userModel from "@/models/user.model";
import { UserRegistration } from "@shared/validations";

export const CreateUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as UserRegistration;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) {
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

    return respond(res, "SUCCESS", "User created successfully", {
      data: { email: req.body.email, name: req.body.name },
    });
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "An error occurred during registration",
      {
        errors: {
          message: (error as Error).message || "Unknown error",
        },
      }
    );
  }
};
