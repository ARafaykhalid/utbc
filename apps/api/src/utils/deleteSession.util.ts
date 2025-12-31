import userModel from "@/models/user.model";
import { Types } from "mongoose";

export const DeleteSession = async (
  userId: Types.ObjectId,
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
