import crypto from "crypto";

export const globalSlugify = (
  slugText,
  update = null,
  model,
  key = "",
  divider = "-"
) => {
  try {
    const cleanString = slugText
      .replace(/[~`{}.'\"!@#$%^&*()_=\+\/?<>,\[\]:;|\\]/g, "")
      .replace(/[\/_|+ -]+/g, "-");
    const slug = cleanString.toLowerCase();
    // TODO: use $this->model() like code laravel
    // const slugCount = (() => {
    //   if (key) {
    //     return model.count({
    //       where: {
    //         [key]: slug,
    //         id: { [Op.ne]: update },
    //       },
    //     });
    //   } else {
    //     return model.count({
    //       where: {
    //         slug: slug,
    //         id: { [Op.ne]: update },
    //       },
    //     });
    //   }
    // })();

    let randomString = randomStringF(3);

    // if (slugCount === 0) {
    //   return slug;
    // } else {
    //   return `${slug}${divider}${randomString}`;
    // }
    return `${slug}${divider}${randomString}`;
  } catch (error) {
    throw error;
  }
};

export const randomStringF = (length = 16) => {
  let string = "";
  while (string.length < length) {
    const size = length - string.length;
    const bytes = crypto.randomBytes(size);
    string += bytes
      .toString("base64")
      .replace(/\/|\+|\=/g, "")
      .substr(0, size);
  }
  return string;
};
