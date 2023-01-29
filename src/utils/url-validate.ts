// from: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function isValidHttpUrl(urlstr: string) {
    let url;
    try {
        url = new URL(urlstr);
    } catch (ex) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}