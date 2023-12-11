import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Question } = models;

export const storeQuestion = async (req) => {
  try {
    req.body.user_id = req.user.id;
    const questionInput = req.body;
    const question = await Question.create(questionInput);
    return question;
  } catch (error) {
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
