import Holidays from 'date-holidays';

import { DateTime } from 'luxon';

const holidays = new Holidays({ country: 'CN' });
export function isNotifyTime(time: Date) {
    const datetime = DateTime.fromJSDate(time).setZone('Asia/Shanghai');
    if (holidays.isHoliday(time) && datetime.hour >= 8) return true;
    else if (datetime.hour >= 18) return true;
    return false;
}
