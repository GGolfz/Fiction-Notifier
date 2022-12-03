import { Database } from "./type/database";
import { assertEqual } from "./utils/assert";
import { checkFictionLog } from "./utils/fictionlog";

const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

const fictionLogJWT = process.env.FICTIONLOG_JWT ?? "";

const selfDB: Database = {
  fictionlog: [],
};

const main = async () => {
  const fictionLogNotify = await checkFictionLog(fictionLogJWT);
  if (
    fictionLogNotify.length > 0 &&
    !assertEqual(fictionLogNotify, selfDB.fictionlog)
  ) {
    console.log("Sending notification");
    selfDB.fictionlog = fictionLogNotify;
  } else {
    console.log("No new chapters for fictionlog");
  }
};

cron.schedule("*/1 * * * *", () => {
  main();
});

main();
