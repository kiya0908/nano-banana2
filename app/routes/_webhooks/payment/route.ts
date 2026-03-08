import type { Route } from "./+types/route";

import {
  handleOrderComplete,
  handleOrderRefund,
  handleSubscriptionCanceled,
  handleSubscriptionExpired,
  handleSubscriptionRenewal,
} from "~/.server/services/order";
import { createCreem } from "~/.server/libs/creem";
import type {
  WebhookBody,
  Checkout,
  Refund,
  Subscription,
} from "~/.server/libs/creem/types";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method.toLowerCase() !== "post") {
    return new Response("Fail Method", { status: 405 });
  }
  const body = await request.text();

  const creemSignature = request.headers.get("creem-signature");
  const creem = createCreem();
  const signature = creem.createWebhookSignature(body);

  try {
    if (creemSignature !== signature) {
      throw Error("Unvalid Signature");
    }

    const { eventType, ...rest } = JSON.parse(body) as WebhookBody;

    // 支付完成事件
    if (eventType === "checkout.completed") {
      const checkout = rest.object as Checkout;
      await handleOrderComplete(checkout.id);
    }
    // 退款事件
    else if (eventType === "refund.created") {
      const v = rest.object as Refund;
      const { checkout } = v;
      await handleOrderRefund(checkout.id);
    }
    // 订阅取消事件（用户主动取消）
    else if (eventType === "subscription.canceled") {
      const sub = rest.object as Subscription;
      await handleSubscriptionCanceled(sub.id);
    }
    // 订阅过期事件（到期未续费）
    else if (eventType === "subscription.expired") {
      const sub = rest.object as Subscription;
      await handleSubscriptionExpired(sub.id);
    }
    // 订阅续费成功事件
    else if (eventType === "subscription.paid") {
      const sub = rest.object as Subscription;
      await handleSubscriptionRenewal(sub.id);
    }

    return Response.json({}, { status: 200 });
  } catch (error) {
    const message = (error as Error).message;
    console.log("Error Event: ", body);
    console.log("Error Message: ", message);

    return Response.json({ message }, { status: 400 });
  }
};

