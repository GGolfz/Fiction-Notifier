import checkFictionLog from "./utils/fictionlog";
const dotenv = require("dotenv");

dotenv.config();
const fictionLogJWT = process.env.FICTIONLOG_JWT ?? "";

const main = async () => {
    const fictionLogNotify = await checkFictionLog(fictionLogJWT);
    if(fictionLogNotify != "") {
        console.log("Sending notification");
    } else {
        console.log("No new chapters for fictionlog");
    }
}

main();