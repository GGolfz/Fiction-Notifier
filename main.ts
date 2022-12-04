import { Database } from "./type/database";
import { assertEqual } from "./utils/assert";
import { checkFictionLog } from "./utils/fictionlog";
import { notify } from "./utils/notify";

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
    notify("FictionLog", fictionLogNotify);
    selfDB.fictionlog = fictionLogNotify;
    console.log("Notify New Chapters of FictionLog at " + new Date());
  }
};

cron.schedule("*/1 * * * *", () => {
  main();
});
