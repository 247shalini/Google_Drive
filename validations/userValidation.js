const { body } = require("express-validator");
const { UserModel } = require("./../models");

const userValidation = [
  body("firstname").not().isEmpty().withMessage("First name is required"),
  body("lastname").not().isEmpty().withMessage("Last name is required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) {
        throw new Error("Email is already taken");
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isStrongPassword()
    .withMessage("Please select a stronger password"),
];

module.exports = {
  userValidation,
};
