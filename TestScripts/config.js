const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "test",
  database: process.env.DB_NAME || "moffer",
  connectionString: process.env.DB_CONN_STRING || "",
  appURL: process.env.APP_URL || "",
  appUriCafe: process.env.APP_URI_CAFE || "",
  appLoginName: process.env.APP_LOGIN_NAME || "",
  appLoginPwd: process.env.APP_LOGIN_PWD|| "",
  testItemMax: process.env.TEST_ITEM_MAX|| "",
  testItemCost: process.env.TEST_ITEM_COST|| "",
  debug: true,
  parseJSON: true,
};
