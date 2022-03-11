"use strict";
const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);

let controllers = {};
// read all files of controller directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const controller = require(path.join(__dirname, file));
    controllers[path.basename(file, ".js")] = controller;
  });

module.exports = controllers;
