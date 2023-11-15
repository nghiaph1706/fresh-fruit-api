// constants.js
import getShopConfig from "./shop.js";

const APP_NOTICE_DOMAIN =
  process.env.APP_NOTICE_DOMAIN ||
  getShopConfig("app_notice_domain") ||
  "MARVEL_";
const DEFAULT_LANGUAGE =
  process.env.DEFAULT_LANGUAGE || getShopConfig("default_language") || "en";
const TRANSLATION_ENABLED =
  process.env.TRANSLATION_ENABLED === "true" ||
  getShopConfig("translation_enabled") ||
  false;
const DEFAULT_CURRENCY =
  process.env.DEFAULT_CURRENCY || getShopConfig("default_currency") || "USD";
const ACTIVE_PAYMENT_GATEWAY =
  process.env.ACTIVE_PAYMENT_GATEWAY ||
  getShopConfig("active_payment_gateway") ||
  "stripe";

const NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.NOT_FOUND";
const COUPON_NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.COUPON_NOT_FOUND";
const INVALID_COUPON_CODE = APP_NOTICE_DOMAIN + "ERROR.INVALID_COUPON_CODE";
const COUPON_CODE_IS_NOT_APPLICABLE =
  APP_NOTICE_DOMAIN + "ERROR.COUPON_CODE_IS_NOT_APPLICABLE";
const ALREADY_FREE_SHIPPING_ACTIVATED =
  APP_NOTICE_DOMAIN + "ERROR.ALREADY_FREE_SHIPPING_ACTIVATED";
const CART_ITEMS_NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.CART_ITEMS_NOT_FOUND";
const NOT_A_RENTAL_PRODUCT = APP_NOTICE_DOMAIN + "ERROR.NOT_A_RENTAL_PRODUCT";
const NOT_AUTHORIZED = APP_NOTICE_DOMAIN + "ERROR.NOT_AUTHORIZED";
const SOMETHING_WENT_WRONG = APP_NOTICE_DOMAIN + "ERROR.SOMETHING_WENT_WRONG";
const PAYMENT_FAILED = APP_NOTICE_DOMAIN + "ERROR.PAYMENT_FAILED";
const SHOP_NOT_APPROVED = APP_NOTICE_DOMAIN + "ERROR.SHOP_NOT_APPROVED";
const INSUFFICIENT_BALANCE = APP_NOTICE_DOMAIN + "ERROR.INSUFFICIENT_BALANCE";
const INVALID_CREDENTIALS = APP_NOTICE_DOMAIN + "ERROR.INVALID_CREDENTIALS";
const EMAIL_SENT_SUCCESSFUL =
  APP_NOTICE_DOMAIN + "MESSAGE.EMAIL_SENT_SUCCESSFUL";
const PASSWORD_RESET_SUCCESSFUL =
  APP_NOTICE_DOMAIN + "MESSAGE.PASSWORD_RESET_SUCCESSFUL";
const INVALID_TOKEN = APP_NOTICE_DOMAIN + "MESSAGE.INVALID_TOKEN";
const TOKEN_IS_VALID = APP_NOTICE_DOMAIN + "MESSAGE.TOKEN_IS_VALID";
const CHECK_INBOX_FOR_PASSWORD_RESET_EMAIL =
  APP_NOTICE_DOMAIN + "MESSAGE.CHECK_INBOX_FOR_PASSWORD_RESET_EMAIL";
const ACTION_NOT_VALID = APP_NOTICE_DOMAIN + "ERROR.ACTION_NOT_VALID";
const PLEASE_LOGIN_USING_FACEBOOK_OR_GOOGLE =
  APP_NOTICE_DOMAIN + "ERROR.PLEASE_LOGIN_USING_FACEBOOK_OR_GOOGLE";
const WITHDRAW_MUST_BE_ATTACHED_TO_SHOP =
  APP_NOTICE_DOMAIN + "ERROR.WITHDRAW_MUST_BE_ATTACHED_TO_SHOP";
const OLD_PASSWORD_INCORRECT =
  APP_NOTICE_DOMAIN + "MESSAGE.OLD_PASSWORD_INCORRECT";
const OTP_SEND_FAIL = APP_NOTICE_DOMAIN + "ERROR.OTP_SEND_FAIL";
const OTP_SEND_SUCCESSFUL = APP_NOTICE_DOMAIN + "MESSAGE.OTP_SEND_SUCCESSFUL";
const REQUIRED_INFO_MISSING =
  APP_NOTICE_DOMAIN + "MESSAGE.REQUIRED_INFO_MISSING";
const CONTACT_UPDATE_SUCCESSFUL =
  APP_NOTICE_DOMAIN + "MESSAGE.CONTACT_UPDATE_SUCCESSFUL";
const INVALID_GATEWAY = APP_NOTICE_DOMAIN + "ERROR.INVALID_GATEWAY";
const OTP_VERIFICATION_FAILED =
  APP_NOTICE_DOMAIN + "ERROR.OTP_VERIFICATION_FAILED";
const CONTACT_UPDATE_FAILED = APP_NOTICE_DOMAIN + "ERROR.CONTACT_UPDATE_FAILED";
const ALREADY_REFUNDED = APP_NOTICE_DOMAIN + "ERROR.ALREADY_REFUNDED";
const ORDER_ALREADY_HAS_REFUND_REQUEST =
  APP_NOTICE_DOMAIN + "ERROR.ORDER_ALREADY_HAS_REFUND_REQUEST";
const REFUND_ONLY_ALLOWED_FOR_MAIN_ORDER =
  APP_NOTICE_DOMAIN + "ERROR.REFUND_ONLY_ALLOWED_FOR_MAIN_ORDER";
const WRONG_REFUND = APP_NOTICE_DOMAIN + "ERROR.WRONG_REFUND";
const CSV_NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.CSV_NOT_FOUND";
const ALREADY_GIVEN_REVIEW_FOR_THIS_PRODUCT =
  APP_NOTICE_DOMAIN + "ERROR.ALREADY_GIVEN_REVIEW_FOR_THIS_PRODUCT";
const USER_NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.USER_NOT_FOUND";
const TOKEN_NOT_FOUND = APP_NOTICE_DOMAIN + "ERROR.TOKEN_NOT_FOUND";
const NOT_AVAILABLE_FOR_BOOKING =
  APP_NOTICE_DOMAIN + "ERROR.NOT_AVAILABLE_FOR_BOOKING";
const YOU_HAVE_ALREADY_GIVEN_ABUSIVE_REPORT_FOR_THIS =
  APP_NOTICE_DOMAIN + "ERROR.YOU_HAVE_ALREADY_GIVEN_ABUSIVE_REPORT_FOR_THIS";
const MAXIMUM_QUESTION_LIMIT_EXCEEDED =
  APP_NOTICE_DOMAIN + "ERROR.MAXIMUM_QUESTION_LIMIT_EXCEEDED";
const INVALID_AMOUNT = APP_NOTICE_DOMAIN + "ERROR.INVALID_AMOUNT";
const INVALID_CARD = APP_NOTICE_DOMAIN + "ERROR.INVALID_CARD";
const TOO_MANY_REQUEST = APP_NOTICE_DOMAIN + "ERROR.TOO_MANY_REQUEST";
const INVALID_REQUEST = APP_NOTICE_DOMAIN + "ERROR.INVALID_REQUEST";
const AUTHENTICATION_FAILED = APP_NOTICE_DOMAIN + "ERROR.AUTHENTICATION_FAILED";
const API_CONNECTION_FAILED = APP_NOTICE_DOMAIN + "ERROR.API_CONNECTION_FAILED";
const SOMETHING_WENT_WRONG_WITH_PAYMENT =
  APP_NOTICE_DOMAIN + "ERROR.SOMETHING_WENT_WRONG_WITH_PAYMENT";
const INVALID_PAYMENT_ID = APP_NOTICE_DOMAIN + "ERROR.INVALID_PAYMENT_ID";
const INVALID_PAYMENT_INTENT_ID =
  APP_NOTICE_DOMAIN + "ERROR.INVALID_PAYMENT_INTENT_ID";
const YOU_CAN_NOT_SEND_MESSAGE_TO_YOUR_OWN_SHOP =
  APP_NOTICE_DOMAIN + "ERROR.YOU_CAN_NOT_SEND_MESSAGE_TO_YOUR_OWN_SHOP";

const constants = {
  APP_NOTICE_DOMAIN,
  DEFAULT_LANGUAGE,
  TRANSLATION_ENABLED,
  DEFAULT_CURRENCY,
  ACTIVE_PAYMENT_GATEWAY,
  NOT_FOUND,
  COUPON_NOT_FOUND,
  INVALID_COUPON_CODE,
  COUPON_CODE_IS_NOT_APPLICABLE,
  ALREADY_FREE_SHIPPING_ACTIVATED,
  CART_ITEMS_NOT_FOUND,
  NOT_A_RENTAL_PRODUCT,
  NOT_AUTHORIZED,
  SOMETHING_WENT_WRONG,
  PAYMENT_FAILED,
  SHOP_NOT_APPROVED,
  INSUFFICIENT_BALANCE,
  INVALID_CREDENTIALS,
  EMAIL_SENT_SUCCESSFUL,
  PASSWORD_RESET_SUCCESSFUL,
  INVALID_TOKEN,
  TOKEN_IS_VALID,
  CHECK_INBOX_FOR_PASSWORD_RESET_EMAIL,
  ACTION_NOT_VALID,
  PLEASE_LOGIN_USING_FACEBOOK_OR_GOOGLE,
  WITHDRAW_MUST_BE_ATTACHED_TO_SHOP,
  OLD_PASSWORD_INCORRECT,
  OTP_SEND_FAIL,
  OTP_SEND_SUCCESSFUL,
  REQUIRED_INFO_MISSING,
  CONTACT_UPDATE_SUCCESSFUL,
  INVALID_GATEWAY,
  OTP_VERIFICATION_FAILED,
  CONTACT_UPDATE_FAILED,
  ALREADY_REFUNDED,
  ORDER_ALREADY_HAS_REFUND_REQUEST,
  REFUND_ONLY_ALLOWED_FOR_MAIN_ORDER,
  WRONG_REFUND,
  CSV_NOT_FOUND,
  ALREADY_GIVEN_REVIEW_FOR_THIS_PRODUCT,
  USER_NOT_FOUND,
  TOKEN_NOT_FOUND,
  NOT_AVAILABLE_FOR_BOOKING,
  YOU_HAVE_ALREADY_GIVEN_ABUSIVE_REPORT_FOR_THIS,
  MAXIMUM_QUESTION_LIMIT_EXCEEDED,
  INVALID_AMOUNT,
  INVALID_CARD,
  TOO_MANY_REQUEST,
  INVALID_REQUEST,
  AUTHENTICATION_FAILED,
  API_CONNECTION_FAILED,
  SOMETHING_WENT_WRONG_WITH_PAYMENT,
  INVALID_PAYMENT_ID,
  INVALID_PAYMENT_INTENT_ID,
  YOU_CAN_NOT_SEND_MESSAGE_TO_YOUR_OWN_SHOP,
};

export default constants;
