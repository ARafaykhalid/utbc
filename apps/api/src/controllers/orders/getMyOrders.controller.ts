import { Request, Response } from "express";
import { respond } from "@api/utils";
import { TAuthData } from "@shared/types";
import { OrderModel } from "@api/models";

export const GetMyOrders = async (req: Request, res: Response) => {
  const { userId } = req.user as TAuthData;

  try {
    const orders = await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-paymentIntent.client_secret -paymentIntent.idempotencyKey")
      .populate({
        path: "items.product",
        model: "Product",
        select: "title slug media",
        populate: { path: "media", model: "Media", select: "url type" },
      })
      .populate({
        path: "items.variant",
        model: "ProductVariant",
        select: "sku price attributes",
        populate: { path: "media", model: "Media", select: "url type" },
      })
      .lean();
    if (!orders || orders.length === 0) {
      return respond(res, "SUCCESS", "No orders found", { data: [] });
    }

    return respond(res, "SUCCESS", "Orders fetched successfully", {
      data: { orders },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch orders", {
      errors: {
        message: (error as Error).message || "Unknown error",
      },
    });
  }
};
