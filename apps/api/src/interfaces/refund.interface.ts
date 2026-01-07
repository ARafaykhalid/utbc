import { Types } from "mongoose";


export interface IRefund {
  order: Types.ObjectId; // the original order
  user: Types.ObjectId; // who requested
  amount: number; // refund amount
  reason?: string;
  status: "requested" | "processed" | "failed";
  paymentProviderRefundId?: string; // e.g. Stripe refund ID
  createdAt: Date;
  updatedAt: Date;
}
