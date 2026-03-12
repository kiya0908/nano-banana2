import { CREEM_ACTIVE_PRODUCT_IDS } from "~/constants/pricing";

export interface PRODUCT {
  price: number;
  credits: number;
  product_id: string;
  product_name: string;
  product_description: string;
  type: "once" | "monthly" | "yearly";
}

export const CREDITS_PRODUCT: PRODUCT = {
  price: 4.9,
  credits: 200,
  product_id: CREEM_ACTIVE_PRODUCT_IDS.credits,
  product_name: "Credit Top-up",
  product_description:
    "Perfect for quick top-ups when you need a few more AI image generations. No subscription required - just buy credits and start creating instantly.",
  type: "once",
};

export const PRODUCTS_LIST = [CREDITS_PRODUCT];
