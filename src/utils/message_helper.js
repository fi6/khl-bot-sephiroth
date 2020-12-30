import bot from './bot_init.js'
import tourney from '../configs/tourney.js'
import db from '../utils/connect_database.js'
import Set from '../models/Set.js'
import Account from '../models/Account.js'
import { gg2khl } from './account_helper.js'

async function sendCalls(set) {
    db.on('error', console.error.bind(console, 'connection error:'));
    let p1 = set.entrants[0];
    let p2 = set.entrants[1];
    let content = `${set.group}组 ${set.fullRoundText}\n@${p1.gamerTag}#2321962160 Vs. @${p2.gamerTag}#2321962160\n请选手于8分钟内在#channel:${tourney.com_channel}; 发送【.签到】进行签到\n`;

    let msg = bot.sendChannelMessage(1, tourney.ping_channel, content);

    return msg
}

async function sendReminder(setId, level) {
    let set = await Set.findById(setId, (err, set) => {
        if (err) {
            console.error(err);
        }
    }).exec();
    let playerString = await checkDQ(set);
    if (level == 'warning') {
        console.log(`warned player, channel: ${tourney.com_channel}, player: ${playerString}, set: ${set.fullRoundText}`);
        let content = `${playerString} 有${set.group}组${set.fullRoundText}的比赛尚未签到。3分钟后将自动弃权。\n`
        bot.sendChannelMessage(1, tourney.com_channel, content);

    } else if (level == 'dq') {
        console.log(`dq player, channel: ${tourney.report_channel}, player: ${playerString}, set: ${set.fullRoundText}`);
        let content = `${set.group}组 ${set.fullRoundText}\n${playerString}超时未签到，已判定弃权。\n`
        bot.sendChannelMessage(1, tourney.report_channel, content);
    }
}


async function checkDQ(set) {
    let playerString = '';
    for (let entrant of set.entrants) {
        if (entrant.checkin !== true) {
            let id = await gg2khl(entrant.ggPlayerId);
            // console.log(id)
            playerString += `(met)${new String(id)}(met) `
        }
    }
    // console.log('PS ', playerString)
    return playerString
}

export { sendCalls, sendReminder }