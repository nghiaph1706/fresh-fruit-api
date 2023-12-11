// config.js

import dotenv from "dotenv";
dotenv.config();

const config = {
  admin_email: process.env.ADMIN_EMAIL,
  shop_url: process.env.SHOP_URL,
  dashboard_url: process.env.DASHBOARD_URL,
  media_disk: process.env.MEDIA_DISK,
  stripe_api_key: process.env.STRIPE_API_KEY,
  app_notice_domain: process.env.APP_NOTICE_DOMAIN || "MARVEL_",
  dummy_data_path: process.env.DUMMY_DATA_PATH || "pickbazar",
  default_language: process.env.DEFAULT_LANGUAGE || "en",
  translation_enabled: process.env.TRANSLATION === "true",
  default_currency: process.env.DEFAULT_CURRENCY || "USD",
  active_payment_gateway: process.env.ACTIVE_PAYMENT_GATEWAY || "stripe",
  razorpay: {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET_KEY,
  },
  mollie: {
    mollie_key: process.env.MOLLIE_KEY,
    webhook_url: process.env.MOLLIE_WEBHOOK_URL,
  },
  stripe: {
    api_secret: process.env.STRIPE_API_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET_KEY,
  },
  paystact: {
    payment_url: process.env.PAYSTACK_PAYMENT_URL,
    secret_key: process.env.PAYSTACK_SECRET_KEY,
  },
  paypal: {
    mode: process.env.PAYPAL_MODE || "sandbox",
    sandbox: {
      client_id: process.env.PAYPAL_SANDBOX_CLIENT_ID || "",
      client_secret: process.env.PAYPAL_SANDBOX_CLIENT_SECRET || "",
    },
    live: {
      client_id: process.env.PAYPAL_LIVE_CLIENT_ID || "",
      client_secret: process.env.PAYPAL_LIVE_CLIENT_SECRET || "",
    },
    payment_action: process.env.PAYPAL_PAYMENT_ACTION || "Sale",
    webhook_id: process.env.PAYPAL_WEBHOOK_ID,
  },
};

export default function getShopConfig(key) {
  const keys = key.split(".");
  let value = { ...config };
  keys.forEach((k) => {
    value = value[k];
  });
  return value;
}
