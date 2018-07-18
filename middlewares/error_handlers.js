const isProduction = process.env.NODE_ENV === "production";

const handle404 = (req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
};

const handle500 = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err
    }
  });
};

module.exports = {
  handle404,
  handle500
};
