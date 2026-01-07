import { Request, Response } from "express";
import { respond } from "@/utils";
import { OrderModel } from "@/models";
import { Types } from "mongoose";
import { TGetOrders } from "@shared/validations";

export const GetOrders = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = -1,
    search,
    paymentStatus,
    deliveryStatus,
    paymentMethod,
    from,
    to,
  } = req.validated?.query as TGetOrders;

  try {
    // Base filter
    const filter: any = {};

    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }

    // Search: try objectId first, otherwise search item title or shipping name/phone
    if (search) {
      const s = search.trim();
      if (/^[0-9a-fA-F]{24}$/.test(s)) {
        filter._id = new Types.ObjectId(s);
      } else {
        const regex = { $regex: s, $options: "i" };
        filter.$or = [
          { "items.title": regex },
          { "shippingAddress.fullName": regex },
          { "shippingAddress.phone": regex },
        ];
      }
    }

    // total count for pagination
    const total = await OrderModel.countDocuments(filter);

    // sort object
    const sortObj: any = { [sortBy]: order };

    // query
    const orders = await OrderModel.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "user", model: "User", select: "name email" })
      .populate({
        path: "items.product",
        model: "Product",
        select: "title slug media",
        populate: { path: "media", model: "Media", select: "url type" },
      })
      .populate({
        path: "items.variant",
        model: "ProductVariant",
        select: "sku price attributes media",
        populate: { path: "media", model: "Media", select: "url type" },
      })
      .lean();

    return respond(res, "SUCCESS", "Orders fetched successfully", {
      data: {
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        orders,
      },
    });
  } catch (error) {
    return respond(res, "INTERNAL_SERVER_ERROR", "Failed to fetch orders", {
      errors: { message: (error as Error).message || "Unknown error" },
    });
  }
};
