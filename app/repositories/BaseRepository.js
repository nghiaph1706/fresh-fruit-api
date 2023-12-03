// public function makeSlug(Request $request, string $key = '', ?int $update = null): string
// {
//     $slugText = match (true) {
//         !empty($request->slug)  => $request->slug,
//         !empty($request->name)  => $request->name,
//         !empty($request->title) => $request->title,
//         !empty($request[$key])  => $request[$key],
//         empty($request->slug)   => 'auto-generated-string',
//     };
//     if (empty($key)) {
//         return globalSlugify(slugText: $slugText, model: $this->model(), update: $update);
//     }
//     return globalSlugify(slugText: $request[$key], model: $this->model(), key: $key, update: $update);
// }
import { globalSlugify } from "../helpers/helpers.js";
export const makeSlug = (req, key = "", update = null) => {
  const slugText = (() => {
    if (req.slug) {
      return req.slug;
    } else if (req.name) {
      return req.name;
    } else if (req.title) {
      return req.title;
    } else if (req[key]) {
      return req[key];
    } else {
      return "auto-generated-string";
    }
  })();

  if (key === "") {
    return globalSlugify(slugText, update);
  } else {
    return globalSlugify(req[key], update);
  }
};
