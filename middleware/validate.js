const { validationResult } = require("express-validator");

/**
 * Validates signup request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const handleValidationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    let errorMessages = {};
    errorsArray.forEach((error) => {
      errorMessages[error.param] = error.msg;
    });
    return res
      .status(422)
      .render("register/register", { 
        errors: errorMessages 
      });
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
