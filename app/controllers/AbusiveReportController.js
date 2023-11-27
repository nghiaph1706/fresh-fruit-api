import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { AbusiveReport } = models;

export const store = async (req, res) => {
  try {
    const model_id = req.body.model_id;
    const model_type = req.body.model_type;
    const user_id = req.user.id;
    const abusiveReport = await AbusiveReport.findOne({
      where: {
        model_id,
        model_type,
        user_id,
      },
    });

    if (!abusiveReport) {
      req.body.user_id = user_id;
      const abusiveReport = await AbusiveReport.create(req.body);
      return res.send(abusiveReport);
    } else {
      res.status(400).json({
        message: constants.YOU_HAVE_ALREADY_GIVEN_ABUSIVE_REPORT_FOR_THIS,
      });
    }
  } catch (error) {
    res.status(400).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};
