import userModel from "@/models/user.model";
import { Types } from "mongoose";

export const DeleteSession = async (
  userId: Types.ObjectId | undefined | string,
  sessionId: Types.ObjectId
): Promise<void> => {
  await userModel.updateOne(
    { _id: userId },
    {
      $pull: {
        sessions: { sessionId },
      },
    }
  );
};
