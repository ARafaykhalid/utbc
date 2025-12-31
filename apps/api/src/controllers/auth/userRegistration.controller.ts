import { Request, Response } from "express";
import argon2 from "argon2";
import { respond } from "@/utils/respond.util";
import userModel from "@/models/user.model";
import { TUserRegistration } from "@shared/validations";
import { Token } from "@/utils/token.util";
import { SendEmailVerificationEmail } from "@/emails/emailVerification.email";

export const CreateUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as TUserRegistration;

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

    const newUser = new userModel({
      email: email,
      password: hashedPassword,
      role: "user",
      name: name,
    });
    await newUser.save();

    const { hashedToken, rawToken, tokenExpiresAt } = Token();

    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationExpires = tokenExpiresAt;
    await newUser.save();

    await SendEmailVerificationEmail(email, rawToken);

    return respond(
      res,
      "SUCCESS",
      "User created successfully, Also email verification sent.",
      {
        data: { email: req.body.email, name: req.body.name },
      }
    );
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
