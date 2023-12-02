import slugify from 'slugify';

export const convertToObject = (str) => {
  const obj = {};

  const pairs = str.split(';');

  pairs.forEach((pair) => {
    const [fullKey, value] = pair.split(':').map((part) => part.trim());
    const keys = fullKey.split('.');
    let nestedObj = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!nestedObj[key]) {
        nestedObj[key] = {};
      }
      nestedObj = nestedObj[key];
    }

    nestedObj[keys[keys.length - 1]] = value;
  });

  return obj;
};

export const customSlugify = (str) => {
  const slug = slugify(str, {
    replacement: '-',
    lower: true,
  });
  return slug;
};
