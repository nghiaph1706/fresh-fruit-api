import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";

const { Setting } = models;

export const currencyToWalletPoints = async (currency) => {
    const currencyToWalletRatio = await currencyToWalletRatio();
    let points = currency * currencyToWalletRatio;
    return parseInt(points);
}

const currencyToWalletRatio = async () => {
    let currencyToWalletRatio = 1;
    try {
        const settings = await Setting.findOne({
            where: {
                language: constants.DEFAULT_LANGUAGE,
            },
        });
        currencyToWalletRatio = settings.options.currencyToWalletRatio;
    } catch (error) {
        currencyToWalletRatio = 1;
    }

    return currencyToWalletRatio == 0 ? 1 : currencyToWalletRatio;

}