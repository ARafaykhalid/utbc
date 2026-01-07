import { Resend } from "resend";
import { config } from "@/config";
import { verificationTokenURL } from "@/utils";
import { HydratedDocument } from "mongoose";
import { IOrder } from "@/interfaces";

const resend = new Resend(config.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
  order: HydratedDocument<IOrder>,
  email: string,
  paymentMethod: "STRIPE" | "COD",
  token: string
) => {
  const populatedOrder = await order.populate([
    {
      path: "items.product",
      select: "title media",
      populate: { path: "media", select: "url type -_id" },
    },
    {
      path: "items.variant",
      select: "title media",
      populate: { path: "media", select: "url type -_id" },
    },
  ]);

  const confirmationURL = verificationTokenURL(
    config.DOMAIN,
    "verification/order-confirmation",
    `orderId=${order._id}&token=${token}`
  );

  const tableForOrderItems = populatedOrder.items
    .map((item) => {
      const product = item.product as any;
      const variant = item.variant as any;

      // Media selection logic
      let mediaUrl = "";
      if (variant?.media?.length) {
        mediaUrl = variant.media[0].url;
      } else if (product?.media?.length) {
        if (product.media[0].type === "image") mediaUrl = product.media[0].url;
        else if (product.media[1]) mediaUrl = product.media[1].url;
      }

      return `<tr>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <img src="${mediaUrl}" alt="${
        product.title
      }" style="width:50px;height:50px;object-fit:cover;margin-right:8px;vertical-align:middle;" />
          ${product.title} ${variant?.title ? `(${variant.title})` : ""}
        </td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align:center;">${
          item.quantity
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align:right;">$${(
          item.price * item.quantity
        ).toFixed(2)}</td>
      </tr>`;
    })
    .join("");

  const htmlForConfirmation = `
    <div style="font-family: system-ui, sans-serif; line-height:1.4;">
      <h2>Thank you for your order!</h2>
      <p>Your order has been received and is being processed.</p>
      <p>You can view your order details and track its status by clicking the link below:</p>
      <p><a href="${confirmationURL}">View Order Details</a></p>
      <h3>Order Summary</h3>
      <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${tableForOrderItems}
        </tbody>
      </table>
      <p>Total: $${order.total.toFixed(2)}</p>
      <p>Payment Method: ${paymentMethod}</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return resend.emails.send({
    from: config.FROM_EMAIL,
    to: email,
    subject: "Order Confirmation",
    html: htmlForConfirmation,
  });
};
