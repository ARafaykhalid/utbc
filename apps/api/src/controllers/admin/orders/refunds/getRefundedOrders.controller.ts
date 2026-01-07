import { Request, Response } from "express";
import { respond } from "@/utils";
import { RefundModel } from "@/models";

export const GetRefundedOrders = async (req: Request, res: Response) => {
  try {

    const refundedOrders = await RefundModel.find()
      .sort({ createdAt: -1 })
      .lean();
    if (!refundedOrders || refundedOrders.length === 0) {
      return respond(res, "SUCCESS", "No refund requests found", {
        data: [],
      });
    }

    return respond(res, "SUCCESS", "Refund requests fetched successfully", {
      data: { refundedOrders },
    });
  } catch (error) {
    return respond(
      res,
      "INTERNAL_SERVER_ERROR",
      "Failed to get refund requests",
      {
        errors: { message: (error as Error).message || "Unknown error" },
      }
    );
  }
};
