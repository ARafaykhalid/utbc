import { Request, Response } from "express";
import argon2 from "argon2";
import { UserModel } from "@api/models";
import { TUserRegistration } from "@shared/validations/auth";
import { respond, token } from "@api/utils";
import { sendEmailVerificationEmail } from "@api/emails";

export const UserRegistration = async (req: Request, res: Response) => {
  const { email, password, name } = req.validated?.body as TUserRegistration;

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return respond(res, "CONFLICT", "User already exists with this email", {
        errors: {
          "body.email": "Email is already in use",
        },
      });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      role: "user",
      name: name,
    });

    const { hashedToken, rawToken, tokenExpiresAt } = token();

    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationExpires = tokenExpiresAt;
    await newUser.save();

    await sendEmailVerificationEmail(email, rawToken);

    return respond(
      res,
      "SUCCESS",
      "User created successfully, Also email verification sent.",
      {
        data: { email: email, name: name },
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
