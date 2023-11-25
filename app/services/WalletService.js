import { models } from "../models/index.js";

const { Setting } = models;

export const currencyToWalletPoints = async (currency) => {
  const currencyToWalletRatio = currencyToWalletRatio();
  const points = currency * currencyToWalletRatio;
  return Math.floor(points);
};

export const walletPointsToCurrency = async (points) => {
  const currencyToWalletRatio = currencyToWalletRatio();
  const currency = points / currencyToWalletRatio;
  return parseFloat(currency.toFixed(2));
};

export const currencyToWalletRatio = async () => {
  try {
    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });
    let currencyToWalletRatio = settings.options.currencyToWalletRatio;
    currencyToWalletRatio =
      currencyToWalletRatio === 0 ? 1 : currencyToWalletRatio;
    return currencyToWalletRatio;
  } catch (error) {
    return 1;
  }
};
