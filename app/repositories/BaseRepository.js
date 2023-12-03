import { customSlugify } from "../services/UtilServcie.js";
export const makeSlug = (req, key = "", update = null) => {
  const slugText = (() => {
    if (req.body.slug) {
      return req.body.slug;
    } else if (req.body.name) {
      return req.body.name;
    } else if (req.body.title) {
      return req.body.title;
    } else {
      return "auto-generated-string";
    }
  })();
  return customSlugify(slugText);
};
