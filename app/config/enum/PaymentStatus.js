// PaymentStatus.js

const PaymentStatus = {
  PENDING: "payment-pending",
  PROCESSING: "payment-processing",
  SUCCESS: "payment-success",
  FAILED: "payment-failed",
  REVERSAL: "payment-reversal",
  CASH_ON_DELIVERY: "payment-cash-on-delivery",
  CASH: "payment-cash",
  WALLET: "payment-wallet",
  AWAITING_FOR_APPROVAL: "payment-awaiting-for-approval",
  DEFAULT_PAYMENT_STATUS: "payment-pending",
  REFUNDED: "payment-refunded",
};

export default PaymentStatus;
