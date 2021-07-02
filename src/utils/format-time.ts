import { DateTime } from 'luxon';

export function formatTime(s: Date): string {
    const datetime = DateTime.fromJSDate(s).setZone('Asia/Shanghai');
    const timeString = datetime.toFormat('HH:mm');
    const today = DateTime.now().setZone('Asia/Shanghai');
    let dateString = '';
    if (today.day - datetime.day == 1) {
        dateString = '昨天';
    } else if (today.day - datetime.day == -1) {
        dateString = '明天';
    } else if (today.day - datetime.day < -1 || today.day - datetime.day > 1) {
        dateString = `${datetime.monthLong}/${datetime.day} `;
    }
    return dateString + timeString;
}

export function getNow(tz = 'Asia/Shanghai'): DateTime {
    return DateTime.fromJSDate(new Date()).setZone(tz);
}
