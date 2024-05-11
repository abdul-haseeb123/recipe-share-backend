export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => next(err));
  };
};

export const generateSlug = (title, count) => {
  if (count > 0) {
    return `${title.toLowerCase().trim().replace(/ /g, "-")}-${count}`;
  }
  return title.toLowerCase().trim().replace(/ /g, "-");
};
