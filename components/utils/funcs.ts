function getReadMinutes(html: string) {
  const text = html.replace(/<[^>]+>/g, ""); // remove HTML tags
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // avg 200 wpm
  return minutes;
}
export default getReadMinutes;


import { Timestamp } from "firebase/firestore";

/** Convert Firestore Timestamp -> "DD-MM-YYYY" */
export function formatDateFromTimestamp(ts: Timestamp): string {

  const date = ts.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-11
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const getCurrentFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};
