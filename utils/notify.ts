import axios from "axios";
import { NotifyData } from "../type/NotifyData";

const parseNotifyDataToMessage = (
  platform: string,
  notifyData: Array<NotifyData>
) =>
  `${platform}\n${notifyData
    .map((data) => `${data.title}: ${data.newChaptersCount} ตอน`)
    .join("\n")}`;

export const notify = (platform: string, notifyData: Array<NotifyData>) => {
    const message = parseNotifyDataToMessage(platform, notifyData);
    axios.post("https://notify-api.line.me/api/notify", {
        message: message
    }, {
        headers: {
            Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })

};
