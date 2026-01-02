import { UserModel } from "@/models";
import { Types } from "mongoose";

export const deleteSession = async (
  userId: Types.ObjectId | undefined,
  sessionId: Types.ObjectId
): Promise<void> => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        sessions: { sessionId },
      },
    }
  );
};
