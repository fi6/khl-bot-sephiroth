import Holidays from 'date-holidays';
import Profile, { ProfileDoc } from '../../../models/Profile';
import { DateTime } from 'luxon';
import bot from '../../../init/bot_init';
import { isNotifyTime } from '../../../utils/notif-time';

const holidays = new Holidays({ country: 'CN' });

export const roleManager = async (time: Date, profiles?: ProfileDoc[]) => {
    const datetime = DateTime.fromJSDate(time).setZone('Asia/Shanghai');
    if (profiles?.length) {
        // given profile, just update these
    } else {
        profiles = await Profile.find({ notif: 1 });
    }
    const khlIds = profiles.map((profile) => {
        return profile.kid;
    });
    // no profile given update all
    if (isNotifyTime(time)) {
        // notif on
        for (const id of khlIds) {
            bot.API.guildRole.grant('1843044184972950', id, 20683);
        }
        console.debug('granted roles');
    } else {
        for (const id of khlIds) {
            bot.API.guildRole.revoke('1843044184972950', id, 20683);
        }
        console.debug('revoked roles');
    }
};
