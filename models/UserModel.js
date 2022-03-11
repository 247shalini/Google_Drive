"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  
  firstname: {type: String,required: true,},
  lastname: {type: String,required: true,},
  email: {type: String,required: true,},
  password: {type: String,required: false, default:""},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserModelSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

UserModelSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

UserModelSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

module.exports = mongoose.model('user', UserModelSchema);