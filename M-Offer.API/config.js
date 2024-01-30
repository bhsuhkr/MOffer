const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "prod",
  database: process.env.DB_NAME || "moffer",
  connectionString: process.env.DB_CONN_STRING || "",
  emailHost: process.env.EMAIL_HOST || "",
  emailPort: process.env.EMAIL_PORT || "",
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || "",
  emailFromAddressPwd: process.env.EMAIL_FROM_ADDRESS_PWD || "",
  cronDailySummary: process.env.CRON_DAILY_SUMMARY || "",
  cronDailyEmailRecon: process.env.CRON_DAILY_EMAIL_RECON || "",
  cronDailyEmailReconToAddress: process.env.CRON_DAILY_EMAIL_RECON_TO_ADDRESS || "",
  cronDailyEmailReconSubject: process.env.CRON_DAILY_EMAIL_RECON_SUBJECT || "",
  cronDailyEmailMemberReceipt: process.env.CRON_DAILY_EMAIL_MEMBER_RECEIPT || "",
  debug: true,
  parseJSON: true,
};
