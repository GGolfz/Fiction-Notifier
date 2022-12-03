import { NotifyData } from "../type/NotifyData";

export const assertEqual = (current: Array<NotifyData>, prev: Array<NotifyData>) => {
    if (current.length != prev.length) {
        return false;
    }
    current.sort((a, b) => a.title.localeCompare(b.title));
    prev.sort((a, b) => a.title.localeCompare(b.title));
    for (let i = 0; i < current.length; i++) {
        if (current[i].title != current[i].title || current[i].newChaptersCount != current[i].newChaptersCount) {
            return false;
        }
    }
    return true;
}