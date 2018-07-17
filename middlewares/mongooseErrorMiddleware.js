const isProduction = process.env.NODE_ENV === "production";
const validationErr = (err, req, res, next) => {
  console.log("In validationErr");

  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err
    }
  });
};
module.exports = validationErr;
