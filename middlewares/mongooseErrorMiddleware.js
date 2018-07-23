const isProduction = process.env.NODE_ENV === "production";
const validationErr = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err
    }
  });
};
module.exports = validationErr;
