const jwt = require('jsonwebtoken');
const { format, addMinutes } = require('date-fns');
const tokenTypes = require('../services/token.types');

const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

const accessExpiryTime = {
  expiresIn: +process.env.JWT_ACCESS_EXPIRATION_MINUTES || 365 * 24 * 60 * 60, // 1 year
};

const refreshExpiryTime = {
  expiresIn: +process.env.JWT_REFRESH_EXPIRATION_MINUTES || 365 * 24 * 60 * 60, // 1 year
};

const timeFormat = 'dd-MMM-yyyy hh:mm:ss a';
const todayDate = new Date();

const generateAccessToken = (payload) => {
  return jwt.sign({ ...payload }, accessSecret, accessExpiryTime);
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ ...payload, type: tokenTypes.REFRESH }, refreshSecret, refreshExpiryTime);
};

const getAccessTokenExpiry = () => {
  return format(addMinutes(todayDate, +accessExpiryTime.expiresIn), timeFormat);
};

const getRefreshTokenExpiry = () => {
  return format(addMinutes(todayDate, +refreshExpiryTime.expiresIn), timeFormat);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenExpiry,
  getRefreshTokenExpiry,
};
