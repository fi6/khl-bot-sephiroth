import { DateTime } from 'luxon';

const datetime = DateTime.fromJSDate(new Date()).setZone('Asia/Shanghai');

console.log(datetime.hour, datetime.minute);
